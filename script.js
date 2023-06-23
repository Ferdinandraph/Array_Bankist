'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
console.log(account1);

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displaymov = function(movement, sorted = false){
    containerMovements.innerHTML = ''
    const movs = sorted == true ? movement.slice().sort((a, b) => a - b) : movement
    movs.forEach(function(mov, i){
        const type = mov > 0 ? 'deposit' : 'withdrawal' 
        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>`
    
    containerMovements.insertAdjacentHTML('afterbegin', html)
    }
    )
}

//updating balance
const updateBalance = function(acct){
acct.balance = acct.movements.reduce((acc, mov) =>
    acc + mov
, 0)
labelBalance.textContent = `${acct.balance.toFixed(2)} EURO`
}

//adding username
function createUsername(accts) {
    accts.forEach(function (acct) {
        acct.username = acct.owner.toLowerCase().split(' ').map(word => word[0]).join('');
    });
}
createUsername(accounts);


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


//filter method
const onlyDeposit = movements.filter(mov => (mov > 0))
console.log(onlyDeposit);
const onlyWithdrawal = movements.filter(function(mov){
    if (mov < 0) return Math.abs(mov);
})
console.log(onlyWithdrawal);
//using for of
const forDeposit = [];
for (const mov of movements){
    if (mov > 0) forDeposit.push(mov)
}
console.log(forDeposit);
//map method
const euroPrice = 1.1;
const doltoEuro = movements.map((mov, i, array)=>
    `movement ${i + 1} you ${mov > 0 ? 'deposited' : 'withdrawn'}
    ${Math.abs(mov)} `
 )
console.log(doltoEuro);

//find method vs forEach
const firstWithdrawal = movements.find(mov =>mov < 0)
console.log(firstWithdrawal);

const findOwner = accounts.find(acct => acct.owner == 'Jessica Davis')
accounts.forEach(function(accts){
    if (accts.owner == 'Jessica Davis') console.log(accts);
})
console.log(findOwner);

//sumarry of the deposit
const calcDisplaySumary = function(accts){
    const income = accts.movements.filter(mov => mov > 0).reduce((acc, age) => acc + age, 0);
    const out = accts.movements.filter(mov => mov < 0).reduce((acc, age) => acc + age, 0).toFixed(2);
    console.log(income);
    console.log(Math.abs(out));
    labelSumOut.textContent = `${Math.abs(out)}`;
    labelSumIn.textContent = `${income}`;
    const interest = accts.movements.filter(mov => mov > 0).
    map(deposit => (deposit * 1.2)/100).filter(rem => rem >= 1).reduce((acc, cur, i, arr) => {
        console.log(arr);
        return acc + cur;
    });
    labelSumInterest.textContent = `${interest}`
}

//calling all functions in a function
const updateGUI = function(acc){
    //displaymovements
    displaymov(acc.movements)
    //update balance
    updateBalance(acc)
    //calculate summary
    calcDisplaySumary(acc)
}
//Event handlers
let currentAccount = 0;
btnLogin.addEventListener('click', function(e){
    e.preventDefault();
    currentAccount = accounts.find(acct => acct.username == inputLoginUsername.value)
    if (currentAccount.pin === Number(inputLoginPin.value)){
        //welcode GUI message
        labelWelcome.textContent = `welcome ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        inputLoginUsername.value = inputLoginPin.value = ""
        inputLoginPin.blur()
        updateGUI(currentAccount);
    }
})
btnTransfer.addEventListener('click', function(e){
    e.preventDefault(e);
    //amount to be transfered
    const amount = Number(inputTransferAmount.value)
    //the reciever account
    const recieverAcct = accounts.find(acct => acct.username === inputTransferTo.value)
    inputTransferAmount.value = inputTransferTo.value = ""
    //condition to check
    if (recieverAcct && amount > 0 &&  currentAccount.balance >= amount && recieverAcct?.username !== currentAccount.username){
        currentAccount.movements.push(-amount);
        recieverAcct.movements.push(amount)
        updateGUI(currentAccount);
    }    
})
//close btn
btnClose.addEventListener('click', function(e){
    e.preventDefault();
    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
        const index = accounts.findIndex(acct => acct.username === currentAccount.username)
        accounts.splice(index, 1)
        containerApp.style.opacity = 0;
    }
    inputClosePin.value = inputCloseUsername.value = ""
})

//loan btn implementing some call
btnLoan.addEventListener('click', function(e){
    e.preventDefault();
    const loanamount = Number(inputLoanAmount.value);
    if (loanamount > 0 &&  Number(currentAccount.movements.some(mov => mov  >= loanamount * 0.1))){
        currentAccount.movements.push(loanamount);
        updateGUI(currentAccount)
        inputLoanAmount.value = ''
    }
})
let sorted = false
btnSort.addEventListener('click', function(e){
    e.preventDefault();
    displaymov(currentAccount.movements, !sorted)
    sorted = !sorted;

})
/////////////////////////////////////////////////
const arr = ['a', 'b', 'c', 'd', 'e', 'f']
/**console.log(arr.slice(2));
console.log(arr.slice(-1));
console.log(arr.slice(2, 5));
console.log(arr.splice(-1));
console.log(arr);
const arr2 = arr.reverse()
console.log(arr2);
console.log([...arr, ...arr2]);
const letters = arr.concat(arr2);
console.log(letters);

//using for of
for (const [i, movement] of movements.entries()){
    if (movement > 0){
        console.log(`${i + 1}: ${movement} was deposited`);
    }else{
        console.log(`${i + 1}: ${Math.abs(movement)} was withdrawn `);
    }
}
console.log('-----For Each----');
//using for each
movements.forEach(function(move, i, arr){
    if (move > 0){
        console.log(`${i + 1}: ${move} was deposited`);
    }else{
        console.log(`${i + 1}: ${Math.abs(move)} was withdrawn`);
    }
})
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
  ]);
currencies.forEach(function(value, key, Map){
    console.log(`${value}: ${key}`);
})

const testSet = new Set(['Naira', 'Dollars', 'Pounds'])
testSet.forEach(function(value, _, set){
    console.log(`${value}: ${value}`);
})**/
const checkDogs = function(dogsJulia, dogsKate){
   const newJuliadog  = dogsJulia.slice(1, 3);
   const newArray = newJuliadog.concat(dogsKate);
   console.log(newArray.join(' '));
   newArray.forEach(function(arr, i, array){
        if (arr < 3){
            console.log(`Dog number ${i + 1} is still a puppy🐶`);
        }else{
            console.log(`Dog number ${i + 1} is an adult, and is ${arr} years old`);
        }
   })
}
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])
//getting the largest number of the movement
const max = movements.reduce((acc, mov) =>
{
    if (acc > mov) return acc
    else
    return mov
}, movements[0])
console.log(max);
const age1 = [5, 2, 4, 1, 15, 8, 3]
const age2 = [16, 6, 10, 5, 6, 1, 4]
const calcAverageHumanAge = function(ages){
   const humanAge =  ages.map((age => age <= 2 ? 2 * age : 16 + (age * 4))).filter(age => age >= 18).reduce((acc, age, i,  arr) => acc + age/arr.length, 0);
   console.log(humanAge);

}
calcAverageHumanAge(age1);
calcAverageHumanAge(age2);

//testing some and every
const func  = mov => mov > 0
console.log(movements.some(func));
console.log(movements.filter(func));
console.log(movements.every(func));
const totalbalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(totalbalance);

//sorting
console.log(movements);
console.log(movements.sort((a, b) => {
    //return 
    if (a > b) return (1)
    else if(b > a) return (-1)
}))

const x = (new Array(7))
x.map(() => 5)
console.log(x);
x.fill(1, 3, 5)
console.log(x);
console.log(Array.from({length: 7}, (_, i) => i + 1))
labelBalance.addEventListener('click', function(){
    const movementGUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent));
    console.log(movementGUI);
})

/**Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Forumla:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉) 

Hints:
§ Use many different tools to solve these challenges, you can use the summary
lecture to choose between them 😉
§ Being within a range 10% above and below the recommended portion means:
current > (recommended * 0.90) && current < (recommended *
1.10). Basically, the current portion should be between 90% and 110% of the
recommended portion.*/
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
    ];

dogs.forEach(function(dog){
    dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28)
})
console.log(dogs);
const sarahDog = dogs.find(dog => dog.owners.includes("Sarah")
)
console.log(sarahDog);
console.log(`SarahDog is eating too ${sarahDog.curFood> sarahDog.recommendedFood? 'to much' : "little"}`);

//Creating an array containing all owners of dogs who eat too much
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood).map(dog =>dog.owners).flat()
console.log(`${ownersEatTooMuch.join(" and ")}'s dogs eat too much!"`);
//Creating an array containing all owners of dogs who eat too little and u
const  ownersEatTooLittle= dogs.filter(dog => dog.curFood < dog.recommendedFood).map(dog =>dog.owners).flat()
console.log(`${ownersEatTooLittle.join(" and ")}'s dogs eat too little!`);

console.log(dogs.some(dog => dog.curFood == dog.recommendedFood));

//testing use cases in Numbers
console.log(0.1 + 0.2 === 0.3);
console.log(+"0.3");
console.log(Number.parseInt("32px"));
console.log(Number("20.222"));
console.log(Number.parseFloat("20.6666"));
console.log(Number.parseFloat("2.5rem"));
console.log(Number.isFinite("23"));
console.log(Number.isNaN("23"));
console.log(Number.isNaN(+"23px"));
console.log(Number.isFinite(23));

//more on testing Numbers
console.log(Math.PI * Number.parseFloat("30px") ** 2);

//remainder operand

//bigInt
console.log(2 ** 52 -1);