import session_data from "./sketch_of_all_data.json";

const initState = () => {
	let stringedUp = JSON.stringify(session_data);
	let data = JSON.parse(stringedUp);
	return data;
};
export default initState;
