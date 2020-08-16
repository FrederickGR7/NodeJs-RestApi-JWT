'use strict'
const User = require('../models/user.model');
const userValidation = require('../helper/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path'); 

var controller = {
    home: (req, res) => {
        res.status(200).send('<h1>RestApi JwT Authentication</h1>');
    },
    register: async (req, res) => {
        // Valido el usuario
        const  validation = userValidation.registerValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Valido que no exista el email
        const emailExist = await User.findOne({email: req.body.email});
        if (emailExist) return res.status(400).send('El email se encuentra registrado.');
        // Encrypto la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Creo el usuario
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        try {
            const savedUser = await user.save();
            res.status(200).send({message: 'El usuario ha sido registrado con exito', user: user._id});
        } catch (err) {
            res.status(400).send(err);
        }    
    },
    login: async (req, res) => {
        // Valido el usuario
        const  validation = userValidation.loginValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Valido que existe el email
        const userByEmail = await User.findOne({email: req.body.email});
        if (!userByEmail) return res.status(400).send('El email o la contraseña es incorrecta.');
        // Valido la contraseña
        const validPass = await bcrypt.compare(req.body.password, userByEmail.password);
        if (!validPass) return res.status(400).send('El email o la contraseña es incorrecta.');
        // Creo y asigno el token
        const token = jwt.sign({user: userByEmail}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        return res.status(200).header('Authorization', token).send(token);
    },
    updateUser: async (req, res) => {
        let id = req.params.id;
        // Valido el usuario
        const  validation = userValidation.registerValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Encrypto la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Creo el usuario
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        User.findByIdAndUpdate(id, user, {new:true}, (err, userUpdated) => {
            if(err) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
            if(!userUpdated) return res.status(404).send({message: 'No hay usuarios con este id'});

            return res.status(200).send({message:'El usuario fue actualizado.',user: userUpdated});
        });
    },
    getUserById: (req, res) => {
        let id = req.params.id
        User.findById(id, (err, userById) => {
            if(err) return res.status(500).send({message: 'Error al obtener el usuario'});
            if(!userById) return res.status(404).send({message: 'El usuario no existe'});

            return res.status(200).send(userById);
        });
    },
    getAllUsers: (req, res) => {
        User.find({}).exec((err, users) => {
           if(err) return res.status(500).send({message: 'Error al obtener los datos'});
           if(users.length < 1) return res.status(404).send({message: 'No hay usuarios'});
           
           return res.status(200).send(users);
       });   
    },
    deleteUser: (req, res) => {
        let id = req.params.id;
        User.findByIdAndDelete(id, (err, userDeleted) => {
            if(err) return res.status(500).send({message: 'Usuario no eliminado'});
            if(!userDeleted) return res.status(404).send({message: 'No se pudo eliminar el usuario'});

            return res.status(200).send({message: 'Usuario eliminado', userDeleted});
        })
    },
    uploadImage: (req, res) => {
        let userId = req.params.id;
        var fileName = 'Imagen so subida.';
        if (req.file) {
          var fileExt = req.file.originalname.split('.')[1];
          var fileName = req.file.filename + '.' + fileExt;
          let path_file = req.file.path;
          fs.renameSync(path_file, path_file + '.' + fileExt);
  
          if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

            User.findById(userId, (err, user) => {
              let oldImage = user.image;
              if (oldImage != undefined) {
                fs.unlink('uploads\\' + oldImage, (err) => {
                  
                });
              }
            });

            User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated) => {
              if (err) return res.status(500).send({message: 'La imagen no se ha subido'});
              if (!userUpdated) return res.status(404).send({message: 'El proyecto no existe.'});
    
              return res.status(200).send({user: userUpdated});
            });
  
          } else {
            fs.unlink('uploads\\' + fileName, (err) => {
              if (err) res.status(500).send({err});
              return res.status(500).send({message: 'La extension no es valida, asegurate que no haya punto en el nombre del archivo'});
            });
          }
  
        } else {
          res.status(500).send({message: fileName});
        }
      },
      getImageFile: (req, res) => {
        var file = req.params.image;
        var path_file = './uploads/' + file;
  
        fs.exists(path_file, (exists) => {
          if (exists) {
            return res.sendFile(path.resolve(path_file));
          } else {
            return res.status(404).send({message: 'No existe la imagen'});
          }
        });
      }
}

module.exports = controller;