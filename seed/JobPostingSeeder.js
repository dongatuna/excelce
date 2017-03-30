var Posting = require('../models/jobposting');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/expaddress");

var postings = [

   new Posting({
        organization:"58d8376d5fab330e3065326a",
        title: "Live In Opportunities Available",
        description: "JOB POST 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam orci quam, mattis eu porta id, " +
        "congue nec nibh. Morbi vitae ligula feugiat, luctus sapien eget, volutpat dui. Suspendisse a varius urna. " +
        "Aliquam lorem nunc, lacinia ut varius ac, suscipit sit amet erat. Vivamus eu lacinia ante, at ullamcorper " +
        "velit. Donec at molestie eros. Praesent ac sapien mauris. Praesent mollis pellentesque eros nec bibendum. " +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis mi luctus, congue sem non, viverra quam." +
        " Integer egestas lorem eget justo vestibulum iaculis eget non felis. Praesent massa risus, feugiat eget " +
        "elementum eget, pulvinar quis enim. Nullam pretium ultricies metus non varius. Morbi scelerisque tellus vel " +
        "justo finibus pharetra. Aliquam erat volutpat.",
        requirements:["CNA", "Nurse Delegation", "Diabetes"],
        filePath: "../files/resumes/rn_resume_st_francis.txt",
        respondents:["58dd44d55037ac1374b542d8", "58dd44d55037ac1374b542da"]

    }),

    new Posting({
        organization:"58dd41ddde2af5035cb7f08e",
        title: "CNA and Home Care Aide Needed For Evening Shift",
        description:"JOB POST 2: Maecenas laoreet porta efficitur. Quisque consequat euismod orci molestie tempus. " +
        "Donec vitae tempor metus, sit amet convallis nunc. Maecenas cursus auctor ex, vitae sollicitudin ipsum suscipit" +
        " sit amet. Donec porttitor urna id ante iaculis blandit. Nullam ornare sagittis vestibulum. Nam sed augue nec" +
        " urna suscipit lobortis. Cras laoreet metus a ipsum mattis consectetur vel molestie felis. Ut id volutpat " +
        "massa. Curabitur ante ex, laoreet at leo sit amet, congue hendrerit metus",
        requirements:["CNA", "CPR/FA"],
        filePath:'../files/resumes/rn_resume_st_francis.txt',
        respondents:["58dd44d55037ac1374b542d8"]
    }),

    new Posting({
        organization:"58dd41ddde2af5035cb7f08e",
        title:"Caregivers Needed Urgently",
        description:"JOB POST 3: Sed consequat neque vulputate nisi luctus, efficitur lacinia nulla auctor. Nulla eget nunc mi. " +
        "Phasellus eget orci nec risus volutpat dapibus eget id purus. Donec nec nisl nec magna condimentum gravida ac " +
        "eget risus. Aenean a diam lectus. In feugiat quam diam, at ullamcorper felis porta id. Mauris a dolor quis " +
        "felis elementum tincidunt vel non ante. Quisque fringilla quis libero id viverra. Aliquam fermentum nec felis " +
        "non placerat. Aenean vel dui a elit ultrices interdum. Maecenas quis arcu justo. Interdum et malesuada fames " +
        "ac ante ipsum primis in faucibus. Quisque neque est, faucibus eget est ac, cursus lobortis sem. Donec rhoncus " +
        "non velit eu pretium. Integer id odio libero.",
        requirements:["Dementia", "Mental Health", "Home Care Aide"],
        filePath:'../files/resumes/rn_resume_st_francis.txt',
        respondents:["58dd44d55037ac1374b542d9","58dd44d55037ac1374b542d7"]
    }),

    new Posting({
        organization:"58dd4231de2af5035cb7f08f",
        title:"Home Care Aides Needed For All Shifts",
        description:"JOB POST 4: Vestibulum ullamcorper porttitor urna, eget molestie est ultrices vel. Suspendisse tempor justo " +
        "ut laoreet aliquet. Nulla tellus ligula, pellentesque ut ligula vitae, tristique pharetra odio. Aliquam magna " +
        "mi, tempus ut gravida quis, tempor sit amet mauris. Ut tristique blandit ipsum. Maecenas id rhoncus dolor, " +
        "quis aliquam lacus. Etiam et ante in ligula pretium sodales ut iaculis ipsum. Phasellus nec neque vitae neque " +
        "gravida porttitor.",
        requirements:["CNA", "Home Care Aide"],
        filePath:'../files/resumes/rn_resume_st_francis.txt',
        respondents:null

    }),

    new Posting({
        organization:"58dd41b0de2af5035cb7f08d",
        title:"NAC Needed Now - Pay Starts at $ 16/hour",
        description:"JOB POSTING 5:  Vivamus quam turpis, bibendum eu elit ut, placerat rutrum ex. Vestibulum vulputate" +
        " elit quis erat pellentesque varius. Vestibulum tincidunt ut justo at pulvinar. Nulla ante turpis, pellentesque" +
        " vel risus egestas, mattis faucibus risus. Suspendisse potenti. Pellentesque ac blandit lacus, eget vehicula" +
        " odio. Quisque vitae leo tincidunt, scelerisque est et, condimentum lacus. Integer velit quam, dignissim et " +
        "diam eu, congue pretium nulla. Mauris at volutpat quam, ac interdum nisi. Fusce nec ex quis arcu laoreet " +
        "molestie ut sed odio. Phasellus efficitur magna vel enim ornare, venenatis dapibus purus dapibus. Pellentesque" +
        " bibendum euismod arcu ac imperdiet.",
        requirements:["CNA", "CPR/FA"],
        filePath:'../files/resumes/rn_resume_st_francis.txt',
        respondents:["58dd44d55037ac1374b542d7", "58dd44d55037ac1374b542d9", "58dd44d55037ac1374b542da", "58dd44d55037ac1374b542d8"]
    })

];
/*

"58dd44d55037ac1374b542d7"
"58dd44d55037ac1374b542d9"
"58dd44d55037ac1374b542da"
"58dd44d55037ac1374b542d8"*/

var done=0;

var appnumber = postings.length;

for(var i=0; i<appnumber; i++){
    postings[i].save(function(err, result){

        if(err) console.error(err);
        done++;
        if(done===appnumber){
            exit();
            console.log('items saved');
        }
    });
}

function exit() {
    mongoose.disconnect();
}