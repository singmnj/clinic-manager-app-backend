const stats = require('../model/stats');

let getStats = async(request, response) => {
	let statistics = await stats.getStats();
	response.json(statistics);
};

module.exports = {
	getStats
};