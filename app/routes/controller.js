module.exports = function (app, express) {
    
  const api = express.Router();

  api.get('/api/ping',function (req, res){
    res.status(200).send([{ "success": true }])
  });


  return api;

}