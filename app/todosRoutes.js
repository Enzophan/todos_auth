module.exports = function(app){
    var userHandlers = require ('./auth/userController.js');

    app.route ('/tasks')
        .get(userHandlers.loginRequired, userHandlers.listTodos)
        .post(userHandlers.loginRequired);

    app.route('/auth/register')
        .post(userHandlers.register);

    app.route('/auth/sign_in')
        .post(userHandlers.sign_in);
};