'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      { email: 'root@example.com', name: 'root', image: '/img/admin.jpg' },
      { email: 'user1@example.com', name: 'user1', image: '/img/user1.jpg' },
      { email: 'user2@example.com', name: 'user2', image: '/img/user2.jpg' },
    ]
    const categories = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
    const followship = [[1, 2], [1, 3], [2, 1]]

    return Promise.all([
      queryInterface.bulkInsert('Users', 
        users.map((item, index) => ({
          email: item.email,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: item.name,
          image: item.image,
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
      ),
      queryInterface.bulkInsert('Comments',
        Array.from({ length: 10 }).map((item, index) => ({
          text: faker.lorem.sentence(5, 15),
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 5) + 1
        }))
      ),
      queryInterface.bulkInsert('Favorites',
        [...Array(10)].map((item, index) => ({  // 餐廳各被收藏 1 次
          UserId: 2,
          RestaurantId: ++index
        }))
      ),
      queryInterface.bulkInsert('Favorites',
        [...Array(3)].map((item, index) => ({  // 疊加餐廳被收藏次數
          UserId: 3,
          RestaurantId: ++index
        }))
      ),
      queryInterface.bulkInsert('Followships',
        followship.map(item => ({
          followerId: item[0],
          followingId: item[1],
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Users', null, option),
      queryInterface.bulkDelete('Categories', null, option),
      queryInterface.bulkDelete('Restaurants', null, option),
      queryInterface.bulkDelete('Comments', null, option),
      queryInterface.bulkDelete('Favorites', null, option),
      queryInterface.bulkDelete('Likes', null, option),
      queryInterface.bulkDelete('Followships', null, option),
      queryInterface.bulkDelete('Favorites', null, option),
      queryInterface.bulkDelete('Followships', null, option)
    ])
  }
};