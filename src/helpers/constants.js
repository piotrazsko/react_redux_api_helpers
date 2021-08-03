export const getConstantsFromRequestConstant = (str, div = '/') => {
	const partActionName = str.split('_REQUEST')[0]
	const failedName = partActionName + '_FAILED'
	const successName = partActionName + '_SUCCESS'
	const res = {}
	res[successName.split(div)[1]] = successName
	res[failedName.split(div)[1]] = failedName
	res[str.split(div)[1]] = str
	return res
}
