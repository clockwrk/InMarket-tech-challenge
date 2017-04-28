// Record { 
//	 campaign: 'vegtables_snake_valley',
//   date: '2015-04-07',
//   spend: '27.26',
//   impressions: '5066',
//   actions: '[{"action": "views", "c": 51}, {"y": 50, "action": "views"}, {"action": "views", "b": 89}]' }



let Papa = require('babyparse'),
    fs = require('fs'),
    fileOne = '../data/source1.csv',
    fileTwo = '../data/source2.csv';
contentOne = fs.readFileSync(fileOne, { encoding: 'binary' }),
    contentTwo = fs.readFileSync(fileTwo, { encoding: 'binary' }),
    sourceOne = [],
    sourceTwo = [],
    allowedSource = [],
    uniqueCampaignsInFebruary = [],
    conversationsOnPlants = [],
    plantsConversion = 0,
    dictionaryOfConversionExpenses = {};

Papa.parse(contentOne, {
    header: true,
    step: function(row) {
        sourceOne.push(row.data.pop());
    }
})


Papa.parse(contentTwo, {
    step: function(row) {
        sourceTwo.push(row.data);
    }
})

// populating unique campaigns in february
for (record in sourceOne) {
    let month = "";
    if (sourceOne[record].date) {
        month = (sourceOne[record].date.split('-')[1])
    }
    if (month === '02' && (uniqueCampaignsInFebruary.indexOf(sourceOne[record].campaign) === -1)) {
        uniqueCampaignsInFebruary.push(sourceOne[record].campaign);
    }
}

//populating conversions on plants
for (record in sourceOne) {
    let campaign = sourceOne[record].campaign.split("_");

    if (sourceOne[record].actions) {
        let currentActions = JSON.parse(sourceOne[record].actions);
        if (!(campaign.indexOf('plants') === -1)) {
            currentActions.forEach(action => {

                if ((action.x || action.y) && (action.action === 'conversions')) {
                    plantsConversion += action.x || 0;
                    plantsConversion += action.y || 0;
                }
            });
        }
    }
}
// What audience, asset combination had the least expensive conversions?
for(record in sourceOne){
	// console.log('record', sourceOne[record])
	let campaign = sourceOne[record].campaign.split("_");
	// console.log('audience',campaign[1], 'asset',campaign[2]);

	if(!(dictionaryOfConversionExpenses[campaign[1]+campaign[2]]=== undefined)){
		//dictionaryOfConversionExpenses+=sourceOne[record]
		    if (sourceOne[record].actions) {
        let currentActions = JSON.parse(sourceOne[record].actions);
            currentActions.forEach(action => {

                if ((action.x || action.y) && (action.action === 'conversions')) {
                    dictionaryOfConversionExpenses[""+campaign[1]+campaign[2]].conversions += action.x || 0;
                    dictionaryOfConversionExpenses[""+campaign[1]+campaign[2]].conversions += action.y || 0;
                    dictionaryOfConversionExpenses[""+campaign[1]+campaign[2]].spent += parseInt(sourceOne[record].spend) || 0;
                }
            });
    }

	}else{
		console.log(dictionaryOfConversionExpenses[campaign[1]+campaign[2]], 'Will now exist');
        dictionaryOfConversionExpenses[campaign[1]+campaign[2]] = {};
		dictionaryOfConversionExpenses[campaign[1]+campaign[2]].conversions = 0;
        dictionaryOfConversionExpenses[campaign[1]+campaign[2]].spent = 0;

	}

}


for(combination in dictionaryOfConversionExpenses){
    dictionaryOfConversionExpenses[combination].ratio =1000*(dictionaryOfConversionExpenses[combination].spent/dictionaryOfConversionExpenses[combination].conversions);
}
let sortArray = []
for(let key in dictionaryOfConversionExpenses){
    console.log(key);
    sortArray.push({campaign:key, ratio:dictionaryOfConversionExpenses[key].ratio})
    
}
let answerThreeArray = sortArray.sort(function(a,b){
    return a.ratio - b.ratio
})
console.log('sortArray', sortArray.sort(function(a,b){
    return a.ratio - b.ratio
}))

console.log('source1 size', sourceOne.length)
console.log('source2 size', sourceTwo.length)

let questionOneCount = 0;

// sourceOne.filter((record)=>{
// 	record.forEach( items => {
// 		console.log(items);
// 		item[4].filter(keys=>{
// 			return 
// 		})
// 	})
// })


let num = 0

allowedSource = [];



//only allow actions with x or y to run 
// allowedSource = sourceOne.filter(record => {



// console.log(record.actions,'\n');
// if(record.actions){

// let thing = JSON.parse(record.actions)
// 	while(Array.isArray(thing)){
// 		thing =thing.pop();
// 	}
// let	object = thing
// 	return object.hasOwnProperty('x')||object.hasOwnProperty('y');

// }


// })


console.log(allowedSource.length);

//console.log(uniqueCampaignsInFebruary)
console.log('There were', uniqueCampaignsInFebruary.length, 'unique campaigns in February');
console.log('There were', plantsConversion, 'conversions on plants');
console.log('The cost for each individual campaign is ', answerThreeArray[0].campaign);
// console.log('allowedSource', allowedSource.length);

// for(record in sourceOne){

// 	console.log('record', record);

// }

// sourceOne.forEach(function(record){

// 	console.log('record ',record);

// 	record[3].forEach(function(subRecord){

// 		console.log(subRecord);

// 	});
// });
