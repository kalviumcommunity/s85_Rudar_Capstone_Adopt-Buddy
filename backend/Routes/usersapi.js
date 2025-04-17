const express = require('express');
const router = express.Router();
const users = require('../data.json'); 
 
router.get('/viewuser', (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  } 
}); 

router.get('/viewuser/id/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log('Incoming request for ID:', id);

    const user = users.find((it) => it.id === id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/viewuser/username/:username', (req, res) => {
    try {
      const username = req.params.username;
      console.log('Incoming request for username:', username); 
  
      const user = users.find(it => it.username === username);
  
      if (user) {
        res.status(200).json({ message: `Hi! ${username}` });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  
  

module.exports = router;