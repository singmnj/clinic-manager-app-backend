const PORT = process.env.PORT || 8080;

const allowedOrigins = [
	"https://www.clinicmanager.click",
	"https://clinicmanager.click",
	`http://127.0.0.1:${PORT}`,
	`http://localhost:${PORT}`,
	`http://localhost:${PORT}/`,
];

module.exports = allowedOrigins;
