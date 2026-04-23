const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Assistant Administratif Citoyen actif sur le port ${PORT}`);
});
