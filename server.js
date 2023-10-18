if (process.env.NODE_ENV !== "production") {
	// Load environment variables from .env file in non prod environments
	require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/dbConnection");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");

const app = express();

// logger middleware
app.use(morgan("tiny"));

//Handle options credentials check - before CORS
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static("build"));

app.get("/", (request, response) => {
	response.send("<h1>CMA API</h1>");
});

app.use(require("./routes/register"));
app.use(require("./routes/auth"));
app.use(require("./routes/refresh"));
app.use(require("./routes/logout"));
app.use(verifyJWT);
app.use(require("./routes/stats"));
app.use(require("./routes/patient"));
app.use(require("./routes/consultation"));

app.use(errorHandler);

//Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080;

mongoose.connection.once("open", () => {
	console.log("connected to MongoDB.");
	const server = app.listen(PORT, async () => {
		try {
			console.log(`Server running on port ${PORT}`);
		} catch (err) {
			console.error(err);
		}
	});

	const handleShutdown = () => {
		console.log("termination signal received.");
		console.log("closing http server.");
		server.close(async () => {
			console.log("http server closed.");
			mongoose.connection.close(false).then(() => {
				console.log("MongoDB connection closed.");
				process.exit(0);
			});
		});
	};

	process.on("SIGINT", handleShutdown);
	process.on("SIGTERM", handleShutdown);
});
