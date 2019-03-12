const fs = require('fs');

//функция проверки налия курса
exports.findCourse = function findCourse(url){

    let mainFile = fs.readFileSync('./db/courses.json', 'utf-8');//считываем инфо
    mainFile = JSON.parse(mainFile);


    let urlFormat = url.slice(1);//подготавлеваем url для сравнивания
    let courses = [];//здесь буту доступные курсы
    let result;//здесь будет результат


    //достаем доступные курсы
    mainFile.forEach(function(value, i){
        courses[i]=value.linkCollection;
    });


    //сравниваем курсы с запросом
    result = courses.some(function (value) {
        return value === urlFormat;
    });


    //возвращаем результат
    if(result){
        return url;
    }else{
        return false;
    }
};

//функция создания нового курса
exports.createNewCourse = function createNewCourse(obj) {
    let mainFile = fs.readFileSync('./db/courses.json', 'utf-8');//считываем инфо
    mainFile = JSON.parse(mainFile);
    let courses = [];
    let result;

    mainFile.forEach(function(value, i){
        courses[i]=value.nameCourse;

    });


    result = courses.some(function (value) {
        return value === obj.nameCourse;
    });

    if (result){
        console.log('course not unic');
        return result =  false;

    }else{

        let id;
        if(mainFile[mainFile.length - 1] === undefined){
            id = 0;
        }else if(mainFile[mainFile.length - 1].id === 0){
            id = 1
        }else{
            id = mainFile[mainFile.length - 1].id;
            id++;
        }

        let linkCollection = encodeURIComponent(obj.nameCourse);
        //console.log(decodeURIComponent(nameCollection))

        obj = {id: id, nameCourse: obj.nameCourse, description: obj.description, linkCollection: linkCollection};
        mainFile.push(obj);
        mainFile = JSON.stringify(mainFile);


        fs.writeFile(`./db/${obj.nameCourse}.json`, '[]', 'utf8', function(err){
            if (err) throw err;
        });

        fs.writeFile(`./db/courses.json`, mainFile, 'utf8', function(err){
            if (err) throw err;
        });

        return result =  true;
    }
};

//функция удаления курса
exports.deleteCourse = function deleteCourse(id) {
    let mainFile = fs.readFileSync('./db/courses.json', 'utf-8');//считываем инфо
    mainFile = JSON.parse(mainFile);
    let indexCourses;
    let result;

    mainFile.forEach(function(value, i){
        if(+value.id === +id){
            indexCourses = i;
        }
    });

    if(indexCourses || indexCourses === 0){
        let nameCourseDelete = decodeURIComponent(mainFile[indexCourses].linkCollection);

        mainFile.splice(indexCourses, 1);

        fs.unlink(`./db/${nameCourseDelete}.json`, function (err) {
            if(err) throw err;
        });

        mainFile = JSON.stringify(mainFile);

        fs.writeFile(`./db/courses.json`, mainFile, 'utf8', function(err){
            if (err) throw err;
        });
        return result = true;
    }else{
        return result = false;
    }
};

//функция изменения курса
exports.changeCourse = function changeCourse(obj) {
    let mainFile = fs.readFileSync('./db/courses.json', 'utf-8');//считываем инфо
    mainFile = JSON.parse(mainFile);
    let courses = [];
    let indexCourse;
    let changeCourse;
    let unic;
    let result;

    mainFile.forEach(function(value, i){
        if(+value.id === +obj.id){
            indexCourse = i;
        }
        courses[i]=value.nameCourse;
    });

    courses.splice(indexCourse, 1);

    unic = courses.some(function (value) {
        return value === obj.nameCourse;
    });

    if(unic){
        console.log('Name is not uniq');
        return result = false;
    }else {

        if (indexCourse || indexCourse === 0) {
            let linkCollection = encodeURIComponent(obj.nameCourse);

            changeCourse = mainFile[indexCourse];

            fs.rename(`./db/${changeCourse.nameCourse}.json`, `./db/${obj.nameCourse}.json`, function (err) {
                if (err) throw err;
            });


            changeCourse = {
                id: changeCourse.id,
                nameCourse: obj.nameCourse,
                description: obj.description,
                linkCollection: linkCollection
            };
            mainFile.splice(indexCourse, 1, changeCourse);
            mainFile = JSON.stringify(mainFile);

            fs.writeFile(`./db/courses.json`, mainFile, 'utf8', function (err) {
                if (err) throw err;
            });

            return result = true;
        } else {
            console.log('Error save');
            return result = false;
        }
    }
};

