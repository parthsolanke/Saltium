require('dotenv').config();
require('./config/database');
const app = require('./config/server');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
