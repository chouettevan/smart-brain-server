
const handleRegister = (req,res,db,bcrypt) => {
    const { name,email,password } = req.body;
    const hash = bcrypt.hashSync(password,10);
    if (!email || !name || !password ) {
        return res.status(400).json('incorrect form submission');
    }
    db.transaction(trx => {
         trx.insert({
             hash:hash,
             email:email
         })
         .into('login')
         .returning('email')
         .then(loginEmail => {
             return trx('users')
             .returning('*')
             .insert({
                 email:loginEmail[0].email,
                 name:name,
                 joined:new Date()
             })
             .then(data => res.json(data[0]));    
         })
         .then(trx.commit)
         .catch(trx.rollback);
    })
    .catch(err=>res.status(400).json('register failed'));  
  
};
export default handleRegister;