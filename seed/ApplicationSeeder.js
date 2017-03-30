var Application = require('../models/application');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/expaddress");



var applications = [

    new Application({
        provider: "58dd408dde2af5035cb7f08a",
        description: 'Adipiscing fusce quis elementum curabitur, sapien libero lectus urna mattis, nisl suscipit ' +
        'sagittis rutrum, non bibendum donec volutpat nec. Dictum natoque ac eu platea leo, et sed aliquam lorem erat ' +
        'etiam nulla, cras tincidunt velit erat quis odio, etiam enim sit eget orci, diam nec mollis curabitur. ' +
        'Vestibulum risus metus sit, justo ut semper cras ac, litora auctor non purus, pellentesque lacus omnis vitae ' +
        'ligula aliquam, mauris mauris eu iaculis nam. Dolor donec mauris amet tortor orci, vitae id aut viverra magna ' +
        'convallis vitae, quisque lacus suscipit rutrum excepturi felis eros. At felis cras consectetuer nibh, ipsum ' +
        'quam sed cras elit lobortis, pellentesque erat id ante, ipsum sunt. Viverra sed egestas elit. Erat leo' +
        ' ultricies erat nibh sed diam, vulputate elit phasellus nibh nulla commodo, erat dolor nisl turpis, litora ' +
        'dui, convallis nulla mollis conubia augue. Hendrerit in risus sit velit eleifend laboris, viverra amet etiam, ' +
        'vitae risus.' ,
        certification: ["CNA", "Dementia", "Mental Health"],
        filePath: '../files/resumes/rn_resume_seattle_children.txt'
    }),

    new Application({
        provider: "58dd4146de2af5035cb7f08b",
        description: 'Lorem ipsum dolor sit amet, sapien sit fames. Tortor enim, pretium sapien nunc lectus accumsan ' +
        'consectetuer, suspendisse orci accumsan in duis ante vehicula, et nulla vel egestas eu, aut faucibus elementum.' +
        ' Rhoncus sociosqu nec, integer ut donec in facilisis, porta lectus scelerisque lectus, quam amet libero nullam' +
        ' lacus dui nunc, architecto nam ullamcorper sit at bibendum. Sunt potenti sit vel euismod condimentum erat. ' +
        'Dolor imperdiet ac, feugiat interdum nullam sed per ut vitae, vel et, nisl suscipit massa non iaculis at ' +
        'aliquam, urna sit parturient tincidunt neque a. Lacinia integer pharetra malesuada fusce venenatis, sagittis' +
        ' ipsum donec ut. Conubia elementum laoreet, placerat morbi vivamus eget congue, mattis faucibus molestie ' +
        'vestibulum morbi ullam, condimentum et sed, habitasse cras a nunc. Dolor vitae ac. Aliquam vitae scelerisque ' +
        'et, vel inceptos dictum vestibulum risus justo vel.' ,
        certification: ["CNA"],
        filePath: '../files/resumes/rn_resume_northwest.txt'
    }),

    new Application({
        provider: "58dd417ede2af5035cb7f08c",
        description: 'Mauris dui ligula ac convallis quis. Lacinia at facilisi, dictum massa conubia porta, ' +
        'tempor amet mauris mi per ipsum, venenatis enim amet. Dolor imperdiet nulla platea, scelerisque morbi leo ut ' +
        'dolor mauris, vitae sodales egestas consequat ipsum, erat posuere vitae, diam fringilla vitae neque id. ' +
        'Eu integer convallis aptent aliquam adipiscing mauris, quam nulla in, nibh placerat augue eget erat. Eget ' +
        'nunc orci dis fermentum nibh, rutrum in donec. Et ut sed est, ligula morbi maecenas praesent erat neque risus. ' +
        'Id ridiculus sit elementum risus lorem sagittis, in lectus occaecati. In posuere tortor, massa vel nulla, ' +
        'elit turpis arcu dui.' ,
        certification: ["CNA", "CPRFA"],
        filePath: '../files/resumes/rn_resume_harborview.txt'
    }),

    new Application({
        provider: "58dd427bde2af5035cb7f090",
        description: 'Sed congue sed massa suscipit, eu odio sollicitudin lorem eget sociis in, a viverra rhoncus ' +
        'integer eaque vivamus eius, amet egestas donec ullamcorper augue. Lobortis posuere, quis pretium suspendisse' +
        ' donec orci urna, quam neque lacinia. Auctor nulla odio justo vel, ut justo, sem amet penatibus, id elementum' +
        ' lacinia condimentum. Quam libero bibendum consectetuer laoreet, nascetur donec, pede tristique est, a dui' +
        ' pellentesque in praesent metus. Ut tellus pulvinar conubia dolor tellus mauris, quidem ipsum at, ut in enim ' +
        'vitae aliquam, sed fusce ut semper massa nulla, lorem lacus sed semper at. Mauris in nonummy mattis ad rutrum.' +
        ' Nullam varius feugiat a nam neque fringilla, massa neque rutrum id in vel faucibus, tristique ut, aliquam per' +
        ' odio nec eros lorem lacus, nisl ipsum tellus.' ,
        certification:["HCA", "Nurse Delegation", "Diabetes", "Dementia", "Mental Health"],
        filePath: '../files/resumes/rn_resume_st_francis.txt'
    })
];

var done=0;

var appnumber = applications.length;

for(var i=0; i<appnumber; i++){
    applications[i].save(function(err, result){

        if(err) console.error(err);
        done++;
        if(done===applications.length){
            exit();
            console.log('items saved');
        }
    });
}

function exit() {
    mongoose.disconnect();
}