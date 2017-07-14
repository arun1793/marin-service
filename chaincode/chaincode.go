package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	// "time"
	//"strings"
	//"reflect"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var userIndexStr = "_userindex"

//var campaignIndexStr= "_campaignindex"
//var transactionIndexStr= "_transactionindex"

type User struct {
		
	Id       	int    `json:"id"`
	FirstName   string `json:"fname"` //the fieldtags of user are needed to store in the ledger
	LastName 	string `json:"lname"`
	Phone    	int    `json:"phone"`
	Email    	string `json:"email"`
	Usertype    string `json:"usertype"`
	Password 	string `json:"password"`
	Repassword  string `json:"repassword"`
}

type AllUsers struct {
	Userlist []User `json:"userlist"`
}
type SessionAunthentication struct {
	Token string `json:"token"`
	Email string `json:"email"`
}
type Session struct {
	StoreSession []SessionAunthentication `json:"session"`
}

type SimpleChaincode struct {
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {

	//_, args := stub.GetFunctionAndParameters()
	var Aval int
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	// Initialize the chaincode
	Aval, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Expecting integer value for asset holding")
	}

	// Write the state to the ledger
	err = stub.PutState("abc", []byte(strconv.Itoa(Aval))) //making a test var "abc", I find it handy to read/write to it right away to test the network
	if err != nil {
		return nil, err
	}

	var empty []string
	jsonAsBytes, _ := json.Marshal(empty) //marshal an emtpy array of strings to clear the index
	err = stub.PutState(userIndexStr, jsonAsBytes)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

// Invoke is ur entry point to invoke a chaincode function
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" {
		return t.Init(stub, "init", args)
	} else if function == "write" {
		return t.write(stub, args)

	} else if function == "registerUser" {
		return t.registerUser(stub, args)
	}
	// } else if function == "Delete" {
	// 	return t.Delete(stub, args)

	// } else if function == "SaveSession" {
	// 	return t.SaveSession(stub, args)

	// }

	fmt.Println("invoke did not find func: " + function)

	return nil, errors.New("Received unknown function invocation: " + function)
}

// write - invoke function to write key/value pair
func (t *SimpleChaincode) write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, value string
	var err error
	fmt.Println("running write()")

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the key and value to set")
	}

	key = args[0] //rename for funsies
	value = args[1]
	err = stub.PutState(key, []byte(value)) //write the variable into the chaincode state
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// Query is our entry point for queries
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "readuser" { //read a variable
		return t.readuser(stub, args)
	}  

	// } else if function == "auntheticatetoken" {
	// 	return t.SetUserForSession(stub, args)

	// }
	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query: " + function)
}

// read - query function to read key/value pair

func (t *SimpleChaincode) readuser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the var to query")
	}

	name = args[0]
	valAsbytes, err := stub.GetState(name) //get the var from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + name + "\"}"
		return nil, errors.New(jsonResp)
	}

	return valAsbytes, nil //send it onward
}
//registeruser - invoke function to store values in ledger. 
func (t *SimpleChaincode) registerUser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
    var err error

    if len(args) != 7 {
        return nil, errors.New("Incorrect number of arguments. Expecting 6")
    }

    //input sanitation
    fmt.Println("- start registration")
    if len(args[0]) <= 0 {
        return nil, errors.New("1st argument must be a non-empty string")
    }
    if len(args[1]) <= 0 {
        return nil, errors.New("2nd argument must be a non-empty string")
    }
    if len(args[2]) <= 0 {
        return nil, errors.New("3rd argument must be a non-empty string")
    }
    if len(args[3]) <= 0 {
        return nil, errors.New("4th argument must be a non-empty string")
    }
    if len(args[4]) <= 0 {
        return nil, errors.New("5th argument must be a non-empty string")
    }
    if len(args[5]) <= 0 {
        return nil, errors.New("6th argument must be a non-empty string")
    }
	 if len(args[6]) <= 0 {
        return nil, errors.New("6th argument must be a non-empty string")
    }
	if len(args[7]) <= 0 {
        return nil, errors.New("7th argument must be a non-empty string")
    }
	
    
    user := User{}

	user.Id, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Failed to get id as cannot convert it to int")
	}

    user.FirstName=args[1]
    user.LastName = args[2]
    user.Phone, err = strconv.Atoi(args[3])
    if err != nil {
        return nil, errors.New("Failed to get phone as cannot convert it to int")
    }
	user.Email = args[4]
	user.Usertype=args[5]
    user.Password = args[6]
    user.Repassword=args[7]

    fmt.Println("user", user)

    UserAsBytes, err := stub.GetState("getusers")
    if err != nil {
        return nil, errors.New("Failed to get users")
    }
    var allusers AllUsers
    json.Unmarshal(UserAsBytes, &allusers) //un stringify it aka JSON.parse()

    allusers.Userlist = append(allusers.Userlist, user)
    fmt.Println("allusers", allusers.Userlist) //append to allusers
    fmt.Println("! appended user to allusers")
    jsonAsBytes, _ := json.Marshal(allusers)
    fmt.Println("json", jsonAsBytes)
    err = stub.PutState("getusers", jsonAsBytes) //rewrite allusers
    if err != nil {
        return nil, err
    }
    fmt.Println("- end user_register")
    return nil, nil
}

func (t *SimpleChaincode) userLogin(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	//input sanitation
	fmt.Println("login")
	if len(args[0]) <= 0 {
		return nil, errors.New("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return nil, errors.New("2nd argument must be a non-empty string")
	}

	email := args[0]

	password := args[1]
	

	UserAsBytes, err := stub.GetState("getusers")
	if err != nil {
		return nil, errors.New("Failed to get users")
	}
	var allusers AllUsers
	json.Unmarshal(UserAsBytes, &allusers) //un stringify it aka JSON.parse()

	for i := 0; i < len(allusers.Userlist); i++ {

		if allusers.Userlist[i].Email == email && allusers.Userlist[i].Password == password {

			return []byte(allusers.Userlist[i].Email), nil
		}
	}
	return nil, nil
}


