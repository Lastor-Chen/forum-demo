const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship
const Like = db.Like
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

// custom module
const { checkSignUp } = require('../../lib/checkForm.js')

module.exports = {
  getUser: async (req, res, cb) => {
    try {
      const UserId = +req.params.id   // 被瀏覽者id
      const operatorId = req.user.id    // 使用者id
      const isOwner = (operatorId === UserId)

      // 一齊 Query，showedUser 為 "被瀏覽者"
      const [comments, showedUser] = await Promise.all([
        Comment.findAll({ where: { UserId }, include: Restaurant }),
        User.findByPk(UserId, { include: { all: true, nested: false } })
      ])

      // following
      const following = {
        users: showedUser.Followings,
        count: showedUser.Followings.length
      }

      // follower
      const follower = {
        users: showedUser.Followers,
        count: showedUser.Followers.length
      }
      const isFollowed = follower.users.some(user => user.id === operatorId)

      // 收藏的餐廳
      const favRestaurant = {
        restaurants: showedUser.FavoriteRestaurants,
        count: showedUser.FavoriteRestaurants.length
      }

      // 已評論餐廳
      const uniqRests = comments.filter((comment, index, self) =>  // 去除重複評論的餐廳
        index === self.findIndex(refItem => (
          comment.Restaurant.id === refItem.Restaurant.id
        ))
      )
      const comment = {
        comments: uniqRests,
        count: uniqRests.length
      }

      cb({ css: 'user', showedUser, isOwner, isFollowed, following, follower, comment, favRestaurant })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  putUser: async (req, res, cb) => {
    try {
      if (!req.body.name) return cb({ status: 'error', message: 'Name 不得為空' })
      if (+req.params.id !== req.user.id) return cb({ status: 'error', message: '未具有相關權限' })

      const input = req.body
      const { file } = req
      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        const img = await imgur.uploadFile(file.path)
        input.image = img.data.link
      }

      const user = await User.findByPk(req.user.id)
      await user.update(input)
      cb({ status: 'success', message: 'user profile was successfully updated', user })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  addFavorite: async (req, res, cb) => {
    try {
      const favorite = await Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.RestaurantId
      })

      cb({ status: 'success', message: 'successfully added a restaurant to favorites ', favorite })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  removeFavorite: async (req, res, cb) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.RestaurantId
        }
      })
      
      await favorite.destroy()
      cb({ status: 'success', message: 'successfully deleted a restaurant from favorites', favorite })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  addLike: async (req, res, cb) => {
    try {
      const like = await Like.create({
        UserId: req.user.id,
        RestaurantId: req.params.RestaurantId
      })

      cb({ status: 'success', message: 'successfully set a restaurant as like ', like })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  removeLike: async (req, res, cb) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.RestaurantId
        }
      })

      await like.destroy()
      cb({ status: 'success', message: 'successfully set a restaurant as unlike', like })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  getTopUser: async (req, res, cb) => {
    try {
      const users = (
        (await User.findAll({ include: 'Followers' }))
          .map(user => {  // 迭代添加屬性
            user.FollowerCount = user.Followers.length,
            user.isFollowed = req.user.Followings.some(v => v.id === user.id)
            return user
          })
          .sort((a, b) => b.FollowerCount - a.FollowerCount)  // 依 Follower數 排序
      )

      cb({ css: 'topUsers', users })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  addFollowing: async (req, res, cb) => {
    try {
      const followship = await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })

      cb({ status: 'success', message: 'successfully set to following', followship })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  removeFollowing: async (req, res, cb) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })

      await followship.destroy()
      cb({ status: 'success', message: 'successfully removed from following', followship })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  }
}