import { Request, Response } from 'express';
import Pet from '../models/Pet.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const createPet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, age, species, breed, gender, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const pet = await Pet.create({
      name,
      age,
      species,
      breed,
      gender,
      description,
      image: req.file.path,
      shelter: req.user?.id,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPets = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword as string,
            $options: 'i',
          },
        }
      : {};

    const speciesFilter = req.query.species ? { species: req.query.species } : {};
    
    const query = { ...keyword, ...speciesFilter, isAdopted: false };

    const count = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .populate('shelter', 'firstName lastName username profileImage')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ pets, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPetById = async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('shelter', 'firstName lastName username profileImage email phone address');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePet = async (req: AuthRequest, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.shelter.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    pet.name = req.body.name || pet.name;
    pet.age = req.body.age || pet.age;
    pet.species = req.body.species || pet.species;
    pet.breed = req.body.breed || pet.breed;
    pet.gender = req.body.gender || pet.gender;
    pet.description = req.body.description || pet.description;
    
    if (req.body.isAdopted !== undefined) {
      pet.isAdopted = req.body.isAdopted;
    }

    if (req.file) {
      pet.image = req.file.path;
    }

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePet = async (req: AuthRequest, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.shelter.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    await pet.deleteOne();
    res.json({ message: 'Pet removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
