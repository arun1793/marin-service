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

type User struct {
	Id       	int    `json:"id"`
	FirstName   string `json:"fname"` //the fieldtags of user are needed to store in the ledger
	LastName 	string `json:"lname"`
	Phone    	int    `json:"phone"`
	Email    	string `json:"email"`
	Usertype    string `json:"usertype"`
	Password 	string `json:"password"`
}

type AllUsers struct {
	Userlist []User `json:"userlist"`
}

type Agreement struct{
	Id	  			   int     `json:"id"`
	ConsignmentWeight  int	   `json:"consignmentweight"`
	ConsignmentValue   int	   `json:"consignmentvalue"`
	InvoiceNo		   int	   `json:"invoiceno"`
	ModeofTransport	   string  `json:"modeoftransport"`
	PackingMode		   string  `json:"packingmode"`
	ContractType	   string  `json:"contracttype"`
	PolicyType	       string  `json:"policytype"`
	ConsignmentType	   string  `json:"consignmenttype"`
}

type AllAgreement struct{
	Querylist []Agreement `json:"querylist"`
}

type Policy struct{
	Id 				   int 	   `json:"id"`
	ConsignmentWeight  int 	   `json:"consignmentweight"`
	ConsignmentValue   int	   `json:"consignmentvalue"`
	ContractType	   string  `json:"contracttype"`
}

type AllPolicy struct{
	Policylist []Policy `json:"policylist"`
}

type Consignment struct{
	
	Id						int		`json:"id"`
	ConsignmentWeight 	    int 	`json:"consignmentweight"`
    ConsignmentValue    	int 	`json:"consignmentvalue"`
    PolicyName 	     		string 	`json:"policyname"`
	SumInsured  			int 	`json:"suminsured"`
	PremiumAmount 	 		int 	`json:"premiumamount"`
	ModeofTransport 		string 	`json:"modeoftransport"`
    PackingMode 			string 	`json:"packingmode"`
    ConsignmentType			string 	`json:"consignmenttype"`
	ContractType 			string 	`json:"contracttype"`
	PolicyType       		string 	`json:"policytype"`
	Email					string	`json:"email"`
	PolicyHolderName		string	`json:"policyholdername"`
	UserType				string	`json:"usertype"`
	InvoiceNo				int 	`json:"invoiceno"`
	PolicyNumber			int		`json:"policynumber"`
}

type AllConsignment struct{
	Consignmentlist []Consignment `json:"consignmentlist"`
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
	}else if function =="fetchPolicyQuotes"{
		return t.fetchPolicyQuotes(stub, args)
	}else if function=="savePolicy"{
		return t.savePolicy(stub, args)
	}else if function=="consignmentDetail"{
		return t.consignmentDetail(stub, args)
	}
	
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
	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query: " + function)
}

// read - query function to read key/value pair
func (t *SimpleChaincode) readuser(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting fname of the var to query")
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
        return nil, errors.New("Incorrect number of arguments. Expecting 7")
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

//fetchPolicyQuotes- invoke function stores details to fetch Quotes.
func (t *SimpleChaincode) fetchPolicyQuotes(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
    var err error

    if len(args) != 9 {
        return nil, errors.New("Incorrect number of arguments. Expecting 5")
    }

    //input sanitation
    fmt.Println("- start filling detail")
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
        return nil, errors.New("5th argument must be a non-empty string")
	}
	if len(args[6]) <= 0 {
        return nil, errors.New("5th argument must be a non-empty string")
	}
	if len(args[7]) <= 0 {
        return nil, errors.New("5th argument must be a non-empty string")
	}
	if len(args[8]) <= 0 {
        return nil, errors.New("5th argument must be a non-empty string")
	}

	agreement := Agreement{}

	agreement.Id, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Failed to get id as cannot convert it to int")
	}

	agreement.ConsignmentWeight, err = strconv.Atoi(args[1])
	if err != nil {
		return nil, errors.New("Failed to get ConsignmentWeight as cannot convert it to int")
	}

	agreement.ConsignmentValue, err = strconv.Atoi(args[2])
	if err != nil {
		return nil, errors.New("Failed to get ConsignmentValue as cannot convert it to int")
	}

	agreement.InvoiceNo, err = strconv.Atoi(args[3])
	if err != nil {
		return nil, errors.New("Failed to get invoiceNo as cannot convert it to int")
	}
	agreement.ModeofTransport=args[4]
	fmt.Println("agreement", agreement)
	
	agreement.PackingMode=args[5]
	fmt.Println("agreement", agreement)
	
	agreement.ContractType=args[6]
	fmt.Println("agreement", agreement)

	agreement.PolicyType=args[7]
	fmt.Println("agreement", agreement)

	agreement.ConsignmentType=args[8]
	fmt.Println("agreement", agreement)

    AgreementAsBytes, err := stub.GetState("get")
    if err != nil {
        return nil, errors.New("Failed to get agreement")
    }
    var allagreement AllAgreement
    json.Unmarshal(AgreementAsBytes, &allagreement) //un stringify it aka JSON.parse()

    allagreement.Querylist = append(allagreement.Querylist, agreement)
    fmt.Println("allagreement",  allagreement.Querylist) //append to allusers
    fmt.Println("! appended agreement to allagreement")
    jsonAsBytes, _ := json.Marshal(allagreement)
    fmt.Println("json", jsonAsBytes)
    err = stub.PutState("get", jsonAsBytes) //rewrite allusers
    if err != nil {
        return nil, err
    }
    fmt.Println("- end of the agreement")
    return nil, nil
}
//savePolicy- invoke function store details to save policy
func(t* SimpleChaincode) savePolicy(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error
	
	if len(args) != 4 {
        return nil, errors.New("Incorrect number of arguments. Expecting 4")
	}
	 //input sanitation
    fmt.Println("- start filling policy detail")
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
	
	policy := Policy{}

	policy.Id, err = strconv.Atoi(args[0])
	
	if err != nil {
		return nil, errors.New("Failed to get id as cannot convert it to int")
	}

	policy.ContractType=args[1]
	fmt.Println("policy", policy)
	
	policy.ConsignmentWeight, err = strconv.Atoi(args[2])
	
	if err != nil {
		return nil, errors.New("Failed to get id as cannot convert it to int")
	}

	policy.ConsignmentValue, err = strconv.Atoi(args[3])
	if err != nil {
		return nil, errors.New("Failed to get id as cannot convert it to int")
	}
	

    fmt.Println("policy", policy)

    policyAsBytes, err := stub.GetState("getpolicy")
    if err != nil {
        return nil, errors.New("Failed to get policy")
    }
	
	var allpolicy AllPolicy
    json.Unmarshal(policyAsBytes, &allpolicy) //un stringify it aka JSON.parse()

    allpolicy.Policylist = append(allpolicy.Policylist, policy)
    fmt.Println("allpolicy",  allpolicy.Policylist) //append to allpolicy
    fmt.Println("! appended policy to allpolicy")
	
	jsonAsBytes, _ := json.Marshal(allpolicy)
    fmt.Println("json", jsonAsBytes)
    err = stub.PutState("getpolicy", jsonAsBytes) //rewrite allpolicy
    if err != nil {
        return nil, err
    }
	
	fmt.Println("- end of the savepolicy")
    return nil, nil
}
//consignmentDetail- invoke function store details of consignmentDetails.
func(t* SimpleChaincode) consignmentDetail(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error
			
	if len(args) != 16 {
        return nil, errors.New("Incorrect number of arguments. Expecting 10")
	}
	 //input sanitation
    fmt.Println("- start filling policy detail")
	if len(args[0])<= 0{
        return nil, errors.New("1st argument must be a non-empty string")
    }

	if len(args[1]) <= 0 {
        return nil, errors.New("2st argument must be a non-empty string")
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
	if len(args[5]) <= 0{
		return nil, errors.New("6th argument must be a non-empty string")
	}
	if len(args[6]) <= 0{
		return nil, errors.New("7th argument must be a non-empty string")
	}
	if len(args[7]) <= 0{
		return nil, errors.New("8th argument must be a non-empty string")
	}
	if len(args[8]) <= 0{
		return nil, errors.New("9th argument must be a non-empty string")
	}
	if len(args[9]) <= 0{
		return nil, errors.New("10th argument must be a non-empty string")
	}
	if len(args[10]) <= 0{
		return nil, errors.New("11th argument must be a non-empty string")
	}
	if len(args[11]) <= 0{
		return nil, errors.New("12th argument must be a non-empty string")
	}
	if len(args[12]) <= 0{
		return nil, errors.New("13th argument must be a non-empty string")
	}
	if len(args[13]) <= 0{
		return nil, errors.New("14th argument must be a non-empty string")
	}
	if len(args[14]) <= 0{
		return nil, errors.New("15th argument must be a non-empty string")
	}
	if len(args[15]) <= 0{
		return nil, errors.New("15th argument must be a non-empty string")
	}
	
	consignment:=Consignment{}

	consignment.Id, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Failed to get premiumamount as cannot convert it to int")
	}
	
	consignment.ConsignmentWeight, err = strconv.Atoi(args[1])
	if err != nil {
		return nil, errors.New("Failed to get premiumamount as cannot convert it to int")
	}

	consignment.ConsignmentValue, err = strconv.Atoi(args[2])
	if err != nil {
		return nil, errors.New("Failed to get premiumamount as cannot convert it to int")
	}
	consignment.PolicyName=args[3]
	fmt.Println("consignment", consignment)

	consignment.SumInsured, err = strconv.Atoi(args[4])
	if err != nil {
		return nil, errors.New("Failed to get premiumamount as cannot convert it to int")
	}

	consignment.PremiumAmount, err = strconv.Atoi(args[5])
	if err != nil {
		return nil, errors.New("Failed to get premiumamount as cannot convert it to int")
	}
	
	consignment.ModeofTransport=args[6]
	fmt.Println("consignment", consignment)

	consignment.PackingMode=args[7]
	fmt.Println("consignment", consignment)

	consignment.ConsignmentType=args[8]
	fmt.Println("consignment", consignment)

	consignment.ContractType=args[9]
	fmt.Println("consignment", consignment)

	consignment.PolicyType=args[10]
	fmt.Println("consignment", consignment)
	
	consignment.Email=args[11]
    fmt.Println("consignment", consignment)
	
	consignment.PolicyHolderName=args[12]
	fmt.Println("consignment", consignment)

	consignment.UserType=args[13]
	fmt.Println("consignment", consignment)

	consignment.InvoiceNo, err = strconv.Atoi(args[14])
	if err != nil {
		return nil, errors.New("Failed to get InvoiceNo as cannot convert it to int")
	}
	consignment.PolicyNumber, err = strconv.Atoi(args[15])
	if err != nil {
		return nil, errors.New("Failed to get InvoiceNo as cannot convert it to int")
	}
	
    consignmentAsBytes, err := stub.GetState("getconsignment")
    if err != nil {
        return nil, errors.New("Failed to get consignment")
    }
	
	var allconsignment AllConsignment
    json.Unmarshal(consignmentAsBytes, &allconsignment) //un stringify it aka JSON.parse()

    allconsignment.Consignmentlist = append(allconsignment.Consignmentlist, consignment)
    fmt.Println("allconsignment",  allconsignment.Consignmentlist) //append to allconsignment
    fmt.Println("! appended policy to allconsignment")
	
	jsonAsBytes, _ := json.Marshal(allconsignment)
    fmt.Println("json", jsonAsBytes)
    err = stub.PutState("getconsignment", jsonAsBytes) //rewrite allconsignment
    if err != nil {
        return nil, err
    }
	
	fmt.Println("- end of the consignmentdetail")
    return nil, nil
}