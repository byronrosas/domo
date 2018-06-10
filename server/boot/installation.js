'use strict';





module.exports = function (app) {





    var User = app.models.usuario;

    var Role = app.models.role;

    var RoleMapping = app.models.RoleMapping;





    RoleMapping.belongsTo(User);

    User.hasMany(RoleMapping, {foreignKey: 'principalId'});

    Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});



    User.find({limit: 1}, function (err, users) {



        if (err == null && users && users.length == 0) {
            console.log("hola...bienvenido admin");

            createDefaultAdminUserRole();

        }else{
            console.log("Necesitas borrar todos los elementos... de usuario, si deseas crear un nuevo administrador");
        }

    });



    function createDefaultAdminUserRole() {



        User.create([

            {
                nombre: "Byron Rosas",
                username: 'byronman',

                email: 'byron_mma@hotmail.es',

                password: 'root123'

            },

        ], function (err, users) {

            if (err) throw err;





            console.log("Created User: ", users);

            //create the admin role

            Role.findOne({where: {name: "Administrador"}, limit: 1}, function (err, roleObj) {

                if (err !== null) {

                    return;

                }

                if (roleObj) {

                    roleObj.principals.create({

                        principalType: RoleMapping.USER,

                        principalId: users[0].id

                    }, function (err, principal) {

                        console.log('Admin Role Create Principal:', principal);

                        // now it should be fine :)

                    });



                } else {

                    Role.create({

                        name: 'Administrador'

                    }, function (err, role) {

                        if (err) throw err;



                        //make bob an admin

                        role.principals.create({

                            principalType: RoleMapping.USER,

                            principalId: users[0].id

                        }, function (err, principal) {

                            console.log('Created principal:', principal);



                            // now it should be fine :)

                        });

                    });

                }

            });





        });

    }



};

