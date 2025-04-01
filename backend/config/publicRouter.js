const { Router } = require('express');
const publicFileRoutes = require('../file/publicFileRoutes');
const router = Router();

router.use('/files', publicFileRoutes);

module.exports = router;
