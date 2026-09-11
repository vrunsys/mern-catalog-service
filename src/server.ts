import config from "config";
import app from "./app";
import logger from "./config/logger";

const startServer = () => {
	try {
		app.listen(config.get("service.port"), () => {
			logger.info(`Server is running on port ${config.get("service.port")}`);
		});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
};

startServer();
