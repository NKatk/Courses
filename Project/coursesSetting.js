const fs = require('fs');

//создание записи
exports.createNewPerson = function createNewPerson(name, obj){
    let courseList = JSON.parse(fs.readFileSync(`./db/${name}.json`, 'utf-8'));
    let objParse = JSON.parse(obj);

    let phone = [];
    let mail = [];

    let phoneUniq, mailUniq;
    let result;

    courseList.forEach(function (val, i) {
        phone[i] = val.phone;
        mail[i] = val.mail;
    });

    phoneUniq = phone.some(function (val) {
        return val === objParse.phone;
    });

    mailUniq = mail.some(function (val) {
        return val === objParse.mail;
    });

    if(phoneUniq){
        console.log('Value phone not uniq');
        return result = 'PHONE';
    }else if(mailUniq){
        console.log('Value mail not uniq');
        return result = 'MAIL';
    }else{
        let id, dateCreate, newCreatePerson;
        if(courseList[courseList.length - 1] === undefined){
            id = 0;
        }else if(courseList[courseList.length - 1].id === 0){
            id = 1
        }else{
            id = courseList[courseList.length - 1].id;
            id++;
        }

        let newDate = new Date();
        let day = newDate.getDate();
        day = ("0" + day).slice(-2);
        let month = newDate.getMonth() + 1;
        month = ("0" + month).slice(-2);
        let year = newDate.getFullYear();

        dateCreate = (year+'-'+month+'-'+day);
        newCreatePerson = {id: id, name: objParse.name, dateBirth: objParse.dateBirth, phone: objParse.phone, mail:objParse.mail, dateCreate: dateCreate}

        courseList.push(newCreatePerson);
        courseList = JSON.stringify(courseList);

        fs.writeFile(`./db/${name}.json`, courseList, 'utf-8', function(err){
            if (err) throw err;
        });

        return result = 'OK';

    }
}

//удаление записи
exports.deletePerson = function deletePerson(name, id) {
    let courseList = JSON.parse(fs.readFileSync(`./db/${name}.json`, 'utf-8'));

    let indexCourses;
    let result;

    courseList.forEach(function(value, i){
        if(+value.id === +id){
            indexCourses = i;
        }
    });

    if(indexCourses || indexCourses === 0){
        courseList.splice(indexCourses, 1);

        courseList = JSON.stringify(courseList);
        fs.writeFile(`./db/${name}.json`, courseList, 'utf8', function(err){
            if (err) throw err;
        });
        return result = true;
    }else{
        return result = false;
    }

}

//изменение записи
exports.changePerson = function changePerson(name, obj){
    let courseList = JSON.parse(fs.readFileSync(`./db/${name}.json`, 'utf-8'));
    let objParse = JSON.parse(obj);

    let phone = [];
    let mail = [];
    let indexValue;
    let phoneUniq, mailUniq;
    let result;
    let changeValue;

    courseList.forEach(function (val, i) {
        if(+val.id === +objParse.id){
            indexValue = i;
        }
        phone[i] = val.phone;
        mail[i] = val.mail;
    });

    phone.splice(indexValue, 1);
    mail.splice(indexValue, 1);

    phoneUniq = phone.some(function (val) {
        return val === objParse.phone;
    });

    mailUniq = mail.some(function (val) {
        return val === objParse.mail;
    });

    if(phoneUniq){
        console.log('Value phone not uniq');
        return result = 'PHONE';
    }else if(mailUniq){
        console.log('Value mail not uniq');
        return result = 'MAIL';
    }else{
        console.log('OK');
        let id, dateCreate, newCreatePerson;
        if(courseList[courseList.length - 1] === undefined){
            id = 0;
        }else if(courseList[courseList.length - 1].id === 0){
            id = 1
        }else{
            id = courseList[courseList.length - 1].id;
            id++;
        }

        changeValue = courseList[indexValue];

        changeValue ={
            id: changeValue.id,
            name: objParse.name,
            dateBirth: objParse.dateBirth,
            phone: objParse.phone,
            mail: objParse.mail,
            dateCreate: changeValue.dateCreate
        };

        console.log(courseList);

        courseList.splice(indexValue, 1, changeValue);
        console.log(courseList);

        courseList = JSON.stringify(courseList);

        fs.writeFile(`./db/${name}.json`, courseList, 'utf-8', function(err){
            if (err) throw err;
        });

        return result = 'OK';
    }
}
