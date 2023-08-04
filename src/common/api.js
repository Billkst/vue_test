let dictionaryUrl = {
    genderList: '/dictionary/gender/list'
}

let userUrl = {
    validateAccountByLogin: '/user/login/validate/',
    login: 'user/login',
    validateAccountByRegister: '/user/register/validate/',
    register: '/user/register',
    logout: '/user/logout',
}

let applyUrl = {
    listByStudent: '/apply/list/',
	addApply: '/apply/item/add/',
	updateApplyByStudent: '/apply/item/update',
	deleteApplyById: '/apply/item/delete/',
	submitApplyByStudent: '/apply/item/status/',

	list: '/apply/list',
	examineApplyByTeacher: '/apply/item/examine'
}

export{
    dictionaryUrl,
    userUrl,
    applyUrl
}