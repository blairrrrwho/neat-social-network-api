const router = require('express').Router();
const {

} = require('../../controllers/thoughtController');

router.route('/').get().post();

router.route('/:id').get().delete();

router.route('/:thoughtId/reactions').post();

router.route('/:thoughtId/reactions/:reactionId').delete();

module.exports = router;
