// Filters user session data by session type.
// RETURNS: 2 arrays
export function FilterSessionsByType(data: []): {} {
	let probeArr: [] = [];
	let trainingArr: [] = [];
	if (data != undefined) {
		data.forEach((e, i) => {
			if (e.session_type === "probe") {
				probeArr[i] = e;
			}
			if (e.session_type === "training") {
				trainingArr[i] = e;
			}
		});
	}
	return { probeArr, trainingArr };
}
