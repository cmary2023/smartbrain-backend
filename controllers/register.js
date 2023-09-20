const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body; // request comes from front-end
    if (!email || !name || !password) {// if name, email or password were kept empty and submitted (i.e. '')
      return res.status(400).json('incorrect form submission');// sending the status(400) is optional
    }
     // (Using bcrypt Asynchronously. 
  // To implement it Synchronously, here's the documentation 
  // https://www.npmjs.com/package/bcrypt-nodejs
    const hash = bcrypt.hashSync(password);// Asynchronous
        // Store hash in your password DB.
      db.transaction(trx => {// Transaction is done for propagation of one or more changes to the database.
        trx.insert({// Creating an object to insert...
          hash: hash, 
          email: email  
        })
        .into('login')// into the login table (contains => id, hash(encrypted password), email ) | Now login table is updated
        .returning('email') // returning for further operations...
        .then(loginEmail => { // into the user table...
          return trx('users')// (contains => id, name, email, entries, joined)
            .returning('*')
            .insert({
              // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
              // loginEmail[0] --> this used to return the email
              // TO
              // loginEmail[0].email --> this now returns the email
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
            })
            .then(user => {// sending response from the server to the front-end
              res.json(user[0]);// user[0] to make sure we are sending one_(filtered)_user and not the whole table
            })
        })
        .then(trx.commit)// incase transaction was successful, then commit the changes 
        .catch(trx.rollback)  // user[0] to make sure we are sending one_(filtered)_user and not the whole table
      })
      .catch(err => res.status(400).json('unable to register'))
  }
  
  module.exports = {
    handleRegister: handleRegister
  };
  
  
