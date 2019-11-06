'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      { email: 'root@example.com', name: 'root' },
      { email: 'user1@example.com', name: 'user1' },
      { email: 'user2@example.com', name: 'user2' },
    ]
    const categories = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']

    return Promise.all([
      queryInterface.bulkInsert('Users', 
        users.map((item, index) => ({
          email: item.email,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: item.name,
          isAdmin: index === 0 ? true : false
        }))
      ),
      queryInterface.bulkInsert('Categories', 
        categories.map((item, index) => ({
          id: index + 1,
          name: item
        }))
      ),
      queryInterface.bulkInsert('Restaurants',
        Array.from({ length: 50 }).map((item, index) => ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          description: faker.lorem.text(),
          CategoryId: Math.floor(Math.random() * 5) + 1
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Users', null, option),
      queryInterface.bulkDelete('Categories', null, option),
      queryInterface.bulkDelete('Restaurants', null, option)
    ])
  }
};