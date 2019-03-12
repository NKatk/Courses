const http = require('http');
const fs = require('fs');

//Подкулючение функций для главной страницы
const findCourse = require('./mainSetting.js').findCourse;
const createNewCourse = require('./mainSetting.js').createNewCourse;
const deleteCourse = require('./mainSetting.js').deleteCourse;
const changeCourse = require('./mainSetting.js').changeCourse;

//подключение функций для страницы курса
const createNewPerson = require('./coursesSetting').createNewPerson;
const deletePerson = require('./coursesSetting').deletePerson;
const changePerson = require('./coursesSetting').changePerson;



http.createServer(function (req, res) {

    //Работа с главной страницей
    if(req.url === '/'){
        let homePage = fs.readFileSync('./public/home.html', 'utf-8');
        res.end(homePage);

    }else if(req.url === '/api/courses'){
        let data = fs.readFileSync('./db/courses.json', 'utf-8');
        res.end(data);

    //Изменения
    }else if(req.url === '/api/mainChangeData'){
        if (req.method === 'POST') {
            let bodyCreateCourse = '';
            req.on('data', function (chunk) {
                bodyCreateCourse += chunk.toString(); // преобразовать буфер в строку
            });
            req.on('end', function () {
                bodyCreateCourse = JSON.parse(bodyCreateCourse);
                if (createNewCourse(bodyCreateCourse)) {
                    res.end('OK');
                } else {
                    res.end('Name not unic')
                }

            });
        }else if(req.method === 'DELETE'){
            console.log('delete');
            let idDeleteCourse = '';
            req.on('data', function (chunk) {
                idDeleteCourse += chunk.toString(); // преобразовать буфер в строку
            });
            req.on('end', function () {
                console.log("Delete: " + idDeleteCourse);
                if(deleteCourse(idDeleteCourse)){
                    console.log('Удаление спешно!');
                    res.end('OK')
                }else {
                    console.log('Курс не найден!');
                    res.end('ERR')
                }

            });
        }else if(req.method === 'PUT') {
            console.log('PUT');
            let ChangeCourse = '';
            req.on('data', function (chunk) {
                ChangeCourse += chunk.toString(); // преобразовать буфер в строку
            });
            req.on('end', function () {
                ChangeCourse = JSON.parse(ChangeCourse);
                if(changeCourse(ChangeCourse)){
                    console.log('Переименование спешно!');
                    res.end('OK')
                }else {
                    console.log('Ошибка сохранения!');
                    res.end('ERR')
                }

            });
        }



    //Работа со страницей курсов
    }else if(req.url === findCourse(req.url)){
        let coursePage = fs.readFileSync('./public/course.html', 'utf-8');
        res.end(coursePage);


    }else if(req.url === `/api${findCourse(req.url.slice(4))}`) {
        let reqUrl = (req.url).slice(5);
        let reqUrlNameFile = decodeURIComponent(reqUrl);
        let dataCourse = fs.readFileSync(`./db/${reqUrlNameFile}.json`, 'utf-8');
        res.end(dataCourse);

    //Изменения
    }else if(req.url === `/change${findCourse(req.url.slice(7))}`){
        let nameCourse = (findCourse(req.url.slice(7))).slice(1);

        if (req.method === 'POST') {
            let createPerson = '';
            req.on('data', function (chunk) {
                createPerson += chunk.toString(); // преобразовать буфер в строку
            });
            req.on('end', function () {
                let result = createNewPerson(nameCourse, createPerson); //озвращает три варианта: 'OK' - когда запись успешна;
                                                                        //'MAIL' - когда мэйл не уникален;
                                                                        //'PHONE' - когда телефон не уникален;
                if (result === 'OK') {
                    console.log('Запись успешна!');
                    res.end('OK');
                } else if (result === 'MAIL') {
                    console.log('Мэйл не уникален!');
                    res.end('MAIL');
                } else if (result === 'PHONE') {
                    console.log('Телефон не уникален!');
                    res.end('PHONE');
                }
            })

        }else if(req.method === 'DELETE'){
            let deleteId = '';
            req.on('data', function (chunk) {
                deleteId += chunk.toString(); // преобразовать буфер в строку
            });
            req.on('end', function () {
                if(deletePerson(nameCourse, deleteId)){
                    console.log('Удаление спешно!');
                    res.end('OK')
                }else {
                    console.log('Не успешно!');
                    res.end('ERR')
                }
            })

        }else if(req.method === 'PUT'){
        let personDataChange = '';
        req.on('data', function (chunk) {
            personDataChange += chunk.toString(); // преобразовать буфер в строку
        });
        req.on('end', function () {
            let result = changePerson(nameCourse, personDataChange);

            if (result === 'OK') {
                console.log('Переименование успешно!');
                res.end('OK');
            } else if (result === 'MAIL') {
                console.log('Мэйл не уникален!');
                res.end('MAIL');
            } else if (result === 'PHONE') {
                console.log('Телефон не уникален!');
                res.end('PHONE');
            }
        })

    }

}else{
        res.statusCode = 404;
        res.end('Page not found!');
    }



}).listen(3000, function () {
    console.log('Server is running!')
});



