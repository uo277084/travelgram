const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController.js');
const publicationController = require('../controllers/PublicationController.js');
const chatController = require('../controllers/ChatController.js');

router.post('/user/add', userController.addUser);
router.put('/user/update/:username', userController.updateUser);
router.put('/user/updatePass/:username', userController.updateUserWithPassword);
router.get('/user/:username', userController.findUserByUsername);
router.get('/user/checkEmail/:email', userController.checkEmail);
router.get('/user/:userId', userController.findUserById);
router.get('/user/id/:username', userController.getUserId);
router.get('/user/login/:username/:password', userController.login);
router.get('/user/checkPassword/:username/:password', userController.checkPassword);
router.get('/user/users/:search', userController.getUsersExceptSessionUser);
router.post('/user/savePost/:username/:postId', userController.saveNewPost);
router.delete('/user/unsavePost/:username/:postId', userController.unsavePost);
router.get('/user/savedPosts/:username', userController.getSavedPosts);
router.get('/user/checkSaved/:username/:postId', userController.checkSavedPost);
router.post('/user/follow/:username/:followed', userController.followUser);
router.delete('/user/unfollow/:username/:followed', userController.unfollowUser);
router.get('/user/followers/:username', userController.getFollowers);
router.get('/user/follows/:username', userController.getFollows);
router.get('/user/checkFollow/:username/:followed', userController.checkFollow);
router.put('/user/updateFollower', userController.changeUserFromFollowers);
router.delete('/user/deletePost/:publicationId', userController.deletePublicationOfSavedPosts);

router.post('/publication/add', publicationController.addPublication);
router.get('/publication/user/:username', publicationController.getPublicationsByUser);
router.get('/publication/country/:country/:username', publicationController.getPublicationsByCountry);
router.get('/publication/countPosts/:username', publicationController.countPublications);
router.put('/publication/addLike/:publicationId', publicationController.addLike);
router.delete('/publication/removeLike/:publicationId', publicationController.removeLike);
router.get('/publication/hasLiked/:publicationId/:username', publicationController.checkLike);
router.get('/publication/likes/:publicationId', publicationController.countLikes);
router.get('/publication/id/:publicationId', publicationController.getPublicationById);
router.get('/publication/comments/:publicationId', publicationController.getCommentsOfPublication);
router.put('/publication/addComment/:publicationId', publicationController.addCommentToAPublication);
router.delete('/publication/removeComment/:publicationId/:commentId', publicationController.deleteComment);
router.put('/publication/images', publicationController.addImagesToAPublication);
router.put('/publication/updateUser', publicationController.changeUser);
router.get('/publication/recommend/:username', publicationController.recommendThreePostsByRankingNotMine);
router.get('/publication/followed', publicationController.getPublicationsOfFollowedUsersOrderedByDate);
router.delete('/publication/delete/:publicationId', publicationController.deletePublication);

router.get('/chat/chats/:username', chatController.getChatOrder);
router.get('/chat/users/:user1/:user2', chatController.getChatByUsers);
router.get('/chat/messages/:chatId', chatController.getMessages);
router.post('/chat/create', chatController.createChat);
router.post('/chat/addMessage', chatController.addMessage);
router.get('/chat/checkChat/:user1/:user2', chatController.checkChat);
router.put('/chat/updateUser', chatController.changeUserFromChat);

module.exports = router;