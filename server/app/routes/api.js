/**
 * Created by Tundaey on 6/24/2015.
 */
var auth = require('../controllers/auth');


module.exports = function(app, express){
    var apiRouter = express.Router();
    apiRouter.post('/register',auth.register);
    apiRouter.post('/verify',auth.verify);
    apiRouter.post('/invite',auth.invite);
    apiRouter.post('/signup',auth.verify);


    /* apiRouter.post('/verify', auth.verify)
     apiRouter.post('/signup', auth.signup);
     apiRouter.post('/register', auth.register);
     apiRouter.post('/login', auth.login);*/
    /*apiRouter.use(auth.authenticate);
    apiRouter.route('/users/:id')
        .get(userController.getUser)
        .put(userController.updateUser)
        .delete(userController.deleteUser);
    apiRouter.get('/doctors', doctorController.getAll);
    apiRouter.get('/doctors/:docId', doctorController.getOne);
    apiRouter.get('/medical_history', historyController.view_medical_history);
    //apiRouter.get('/medical_history/:id', historyController.getOne);
    apiRouter.post('/medical_history', historyController.addHistory);*/


    return apiRouter;
}
