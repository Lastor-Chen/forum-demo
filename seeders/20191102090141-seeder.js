'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users', [{
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true,
        name: 'root'
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user1',
      }, {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user2'
      }]),
      queryInterface.bulkInsert('Restaurants',
        Array.from({ length: 50 }).map(() => ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          description: faker.lorem.text(),
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null),
      queryInterface.bulkDelete('Restaurants', null)
    ])
  }
};
