import { Toast } from 'spaper';
const deptList = [
	{ deptName: 'Comp.Engg.' },
	{ deptName: 'Mech.Engg.' },
	{ deptName: 'Elect.Engg.' },
	{ deptName: 'Elect. & Comm.' },
	{ deptName: 'Info.Tech.' }
];
const designationList = ['Prof.', 'Asst.Prof.'];
const displayToast = (test, type) => {
	Toast.open({
		message: test,

		type,
		duration: 2 * 1000,
		position: 'top',
		dismissible: true
	});
};
const tt = 0;
export { displayToast, designationList, deptList, tt };
