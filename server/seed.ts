import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Pet from './models/Pet.js';
import AdoptionRequest from './models/AdoptionRequest.js';
import Chat from './models/Chat.js';

export const seedDatabase = async () => {
  try {
    // Check if users already exist
    const count = await User.countDocuments();
    if (count > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database...');

    // Clear existing data just in case
    await User.deleteMany({});
    await Pet.deleteMany({});
    await AdoptionRequest.deleteMany({});
    await Chat.deleteMany({});

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const shelter1 = await User.create({
      firstName: 'Happy Paws',
      lastName: 'Shelter',
      username: 'happypaws',
      email: 'contact@happypaws.com',
      password,
      role: 'shelter',
      bio: 'A loving shelter for all animals.',
      phone: '555-0101',
      address: '123 Rescue Lane, Pet City',
      profileImage: 'https://picsum.photos/seed/happypaws/200/200'
    });

    const shelter2 = await User.create({
      firstName: 'City Animal',
      lastName: 'Rescue',
      username: 'cityrescue',
      email: 'info@cityrescue.org',
      password,
      role: 'shelter',
      bio: 'Dedicated to finding homes for city strays.',
      phone: '555-0202',
      address: '456 Safe Haven Blvd, Metropolis',
      profileImage: 'https://picsum.photos/seed/cityrescue/200/200'
    });

    const adopter1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password,
      role: 'adopter',
      bio: 'Looking for a furry friend to join my active lifestyle.',
      phone: '555-0303',
      address: '789 Park Ave, Suburbia',
      profileImage: 'https://picsum.photos/seed/johndoe/200/200'
    });

    const adopter2 = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      password,
      role: 'adopter',
      bio: 'Cat lover seeking a cuddly companion.',
      phone: '555-0404',
      address: '321 Cozy Apt, Downtown',
      profileImage: 'https://picsum.photos/seed/janesmith/200/200'
    });

    console.log('Users created.');

    // Create Pets
    const pet1 = await Pet.create({
      name: 'Buddy',
      age: 3,
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'male',
      description: 'Buddy is a very friendly and energetic dog who loves to play fetch.',
      image: 'https://picsum.photos/seed/buddy/800/600',
      shelter: shelter1._id,
      isAdopted: false
    });

    const pet2 = await Pet.create({
      name: 'Luna',
      age: 2,
      species: 'Cat',
      breed: 'Siamese',
      gender: 'female',
      description: 'Luna is a sweet and vocal cat who enjoys lounging in the sun.',
      image: 'https://picsum.photos/seed/luna/800/600',
      shelter: shelter1._id,
      isAdopted: false
    });

    const pet3 = await Pet.create({
      name: 'Max',
      age: 1,
      species: 'Dog',
      breed: 'German Shepherd',
      gender: 'male',
      description: 'Max is a smart and loyal pup looking for an experienced owner.',
      image: 'https://picsum.photos/seed/max/800/600',
      shelter: shelter2._id,
      isAdopted: false
    });

    const pet4 = await Pet.create({
      name: 'Snowball',
      age: 0.5,
      species: 'Rabbit',
      breed: 'Holland Lop',
      gender: 'female',
      description: 'Snowball is a gentle bunny who loves carrots and gentle pets.',
      image: 'https://picsum.photos/seed/snowball/800/600',
      shelter: shelter2._id,
      isAdopted: false
    });

    console.log('Pets created.');

    // Create Adoption Requests
    const request1 = await AdoptionRequest.create({
      adopter: adopter1._id,
      pet: pet1._id,
      shelter: shelter1._id,
      status: 'pending',
      message: 'I would love to adopt Buddy! I have a large backyard and work from home.'
    });

    const request2 = await AdoptionRequest.create({
      adopter: adopter2._id,
      pet: pet2._id,
      shelter: shelter1._id,
      status: 'approved',
      message: 'Luna looks beautiful. I have had Siamese cats before and would love to give her a home.'
    });

    console.log('Adoption requests created.');

    // Create Chats
    const chat1 = await Chat.create({
      participants: [adopter1._id, shelter1._id],
      messages: [
        {
          sender: adopter1._id,
          content: 'Hi! I submitted an application for Buddy. Is he still available?',
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          sender: shelter1._id,
          content: 'Hello John! Yes, Buddy is still available. We are reviewing your application now.',
          timestamp: new Date(Date.now() - 1800000) // 30 mins ago
        }
      ]
    });

    console.log('Chats created.');
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
