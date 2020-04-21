import React from 'react';
import {
  Alert,
  Platform, 
  Button, 
  Text,
  TextInput, 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  Dimensions, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import CreatButton from './Button';
import base64 from 'base-64';
import {
  createAppContainer,
  DrawerNavigator,
  HeaderNavigationBar,
  StackNavigator,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Logactivity from './Logactivity';
import LogFood from './LogFood';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";

class Meals extends React.Component {
  constructor(props) {
    super(props);
    this.actName = React.createRef();
  
    this.state = {
      meals: {},
      accesscode: "",
      meallist: {},
      showLogFood: false,
      date: "", 
      yOffset: 0,
      foodlisttolog: [],
      mealname: "",
      changeDate: "",
      changeName: "",
      mealtimelist: {},
      totalCalorie: {}, 
      totalCarbo:  {},
      totalFat: {},
      totalProtein: {},
      changeFoodFat: -1,
      changeFoodCarbo: -1, 
      changeFoodProtein: -1,
      changeFoodCalorie: -1,
      changeFoodName: "",

    }
  }


  componentDidMount() {
    // On mount, do the first update
    this.updateFromApi(); // Function that updates component from fetch
    // Subscribe that same function to focus events on the component in the future
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
       this.updateFromApi();
    });
   }
   
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  updateFromApi() {
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", "");
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.props.screenProps.username + ":" + this.props.screenProps.password));

    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };
    

    

    fetch('https://mysqlcs639.cs.wisc.edu/login', requestOptions)
      .then(reponse => reponse.json())
      .then(result => {
        myHeaders.set("x-access-token", result.token);
        requestOptions.headers = myHeaders;
        this.setState({accesscode: JSON.parse(JSON.stringify(result.token))});
        
        fetch('https://mysqlcs639.cs.wisc.edu/meals', requestOptions)
        .then(response2 => response2.json())
        .then(result2 => {
          
          let timelist = {};
          let foodlist = {};
          let calorieslist ={};
          let proteinlist = {};
          let fatlist = {};
          let carbolist ={};
          for (let meal of result2.meals) {
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods', requestOptions)
              .then(response3 => response3.json())
              .then(result3 => {
                let tempfood = {};
                tempfood.id = meal.id;
                tempfood.name = meal.name;
                tempfood.date = meal.date;
                tempfood.foods = result3.foods;
                foodlist[meal.id] = JSON.parse(JSON.stringify(tempfood));
                timelist[meal.id] = meal.date;
                this.setState({meallist: foodlist});
                this.setState({mealtimelist: timelist});
                let tempTotalCalries = 0;
                let tempTotalProteins = 0;
                let tempTotalFat = 0;
                let tempTotalCarbo = 0;

                for (let food of result3.foods) {
                  tempTotalCalries += food.calories;
                  tempTotalCarbo += food.carbohydrates;
                  tempTotalFat += food.fat;
                  tempTotalProteins += food.protein;
                }
                calorieslist[meal.id] = tempTotalCalries;
                proteinlist[meal.id] = tempTotalProteins;
                fatlist[meal.id]= tempTotalFat;
                carbolist[meal.id] = tempTotalCarbo;


                
                this.setState({
                  totalCalorie: calorieslist, 
                  totalCarbo:  carbolist,
                  totalFat: fatlist,
                  totalProtein: proteinlist
                })
                

              });
              this.setState({meals: result2.meals})
          }
          

        })
    });
  }

  setCurrentTime() {
    this.setState({date: moment().format('MMMM D, YYYY h:mm A')});
  }


  
  

  changeMeal(mealID) {
    let obj = {};
    if (this.state.changeName !== "") {
      obj.name = this.state.changeName;
    }
    if (this.state.changeDate !== "") {
      obj.date = this.state.changeDate;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.state.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealID , requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("updated")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      this.setState({changeDate: "", changeName: ""});
      this.updateFromApi();
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
    
  }
  changeFoods(mealID, foodID) {
    let obj = {};
    if (this.state.changeName !== "") {
      obj.name = this.state.changeName;
    }
    if (this.state.changeFoodCalorie !== -1) {
      obj.calories = this.state.changeFoodCalorie;
    }
    if (this.state.changeFoodProtein !== -1) {
      obj.protein = this.state.changeFoodProtein;
    }
    if (this.state.changeFoodFat !== -1) {
      obj.fat = this.state.changeFoodFat;
    }
    if (this.state.changeFoodCarbo !== -1) {
      obj.carbohydrates = this.state.changeFoodCarbo;
    }


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.state.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealID + '/foods/' + foodID, requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("updated")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      this.setState({changeDate: "", changeFoodCalorie: -1, changeFoodProtein: -1, changeFoodCarbo: -1, changeFoodFat: -1});
      this.updateFromApi();
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }
  
  removeFood(mealID, foodID) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.state.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealID + '/foods/' + foodID, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.message.includes("deleted")) {
        Alert.alert("Congratulations!!!", result.message);
        
      } else {
        Alert.alert("OOPS!", result.message)
      }
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }
  

  generateFoodCard(mealID) {
    if (typeof this.state.meallist[mealID] !== 'undefined') {
    let foodlist = this.state.meallist[mealID].foods;
    return foodlist.map((key, index) => {
        return (
          <Card key={key.id}  containerStyle={{backgroundColor: '#6fa3de', borderRadius: 10}}>
            <View>
               <Text style ={{fontWeight: 'bold'}}>Food Id: {key.id}</Text>
               <CreatButton buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.removeFood(mealID,key.id)}/>
            </View>

            <View style={{marginLeft: 5, marginRight: 5, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              

              <Text style={{marginTop: 5, width: 90}}>Food Name: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 125,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {key.name}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeFoodName: text})}}
              />
              
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: -10, flexDirection: 'row', flexWrap: 'wrap'}}>
              
              <Text style={{marginTop: 6, width: 30}}>Fat: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 50,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {`${key.fat}`}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeFoodFat: text})}}
              />
              <Text style={{marginTop: 5, marginLeft: 15, width: 115}}>Carbohydrates: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 50,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {`${key.carbohydrates}`}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeFoodCarbo: text})}}
              />
              
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: -10, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{marginTop: 5, width: 60}}>Protein: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 50,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {`${key.protein}`}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeFoodProtein: text})}}
              />
              
              
              <Text style={{marginTop: 5, marginLeft: 25, width: 65}}>Calories: </Text>
              <TextInput 
               style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 50, textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
               defaultValue= {`${key.calories}`}
               placeholderTextColor="#6f7375"
               onChangeText={(text) => {this.setState({changeFoodCalorie: text})}}
              />

              
            </View>
            

            <View style={{marginLeft: 5, marginRight: 5, marginTop: -8, marginBottom: -8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
              
              <CreatButton
                  buttonStyle={{height: 30, display: 'flex', width: 250, fontSize: 15, alignItems: 'center', justifyContent: 'center' ,backgroundColor: '#7ae063', justifyContent: 'center', borderRadius: 10}}
                  text={'Submit Food Changes'} 
                  textStyle={{color: "#0a0a0a", fontSize: 16, fontWeight: 'bold'}}
                  onPress={() => this.changeFoods(mealID, key.id)}
              /> 
            </View>

            
          </Card>
        )
    })
    }  
    }

  generateCard() {
    let meallist = this.state.meals;
    
    return Object.keys(meallist).map((keyname, index) => {
      
      let key = meallist[keyname];
      if (moment(key.date).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
        return (
          
          <Card key={key.id}  containerStyle={{backgroundColor: '#aae3cd', borderRadius: 10}}>
            <View>
               <Text style ={{fontWeight: 'bold'}}>Meal Id: {key.id}</Text>
               <CreatButton buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.removeMeal(key.id)}/>
            </View>
            <View style={{marginLeft: 5,alignItems: 'center', justifyContent: 'center', marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={{marginTop: 6, width: 80}}>Meal Time: </Text>
            <DatePicker
                  style={{ marginTop: 11, width: 245}}
                  date = {typeof this.state.mealtimelist[key.id] === 'undefined' ? moment(key.date) : moment(this.state.mealtimelist[key.id])}
                  mode="datetime"
                  placeholder="select date"
                  format='MMMM D, YYYY h:mm A'
                  minDate = {new Date(moment().subtract(7,'d'))}
                  maxDate={this.state.currentDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      borderColor: '#86878a',
                      marginLeft: 36,
                      borderRadius: 5 
                    },
                    placeholderText: {
                      color: 'black'
                    }
                  }}
                  onDateChange={(date) => {
                    let currTime = Object.assign({}, this.state.mealtimelist);
                    currTime[key.id] = new Date(date);
                    this.setState({mealtimelist: currTime});
                    this.setState({changeDate: date})
                  }}
              />
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: 8,alignItems: 'center', justifyContent: 'center',  flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{marginTop: -15, width: 60}}>Name: </Text>
              <TextInput
                style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {key.name}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeName: text})}}
              />
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, marginBottom: 8, marginTop: -13, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 10, width: 150}}>
                Calories:  {this.state.totalCalorie[key.id]}  kcal  
              </Text>
              <Text style={{ marginTop: 10, marginLeft: 10, width: 150}}>
                Protein:  {this.state.totalProtein[key.id]}  g
              </Text>
              <Text style={{ marginTop: 5, width: 150}}>
                Fat:  {this.state.totalFat[key.id]}  g  
              </Text>
              
              <Text style={{ marginTop: 5, marginLeft: 10, width: 150}}>
                Carbohydrates:  {this.state.totalCarbo[key.id]}  g  
              </Text>
              
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: -15, marginBottom: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <CreatButton
                  buttonStyle={{flex: 1, height: 40, width: 120, fontSize: 10, alignItems: 'center', backgroundColor: '#bd5ee0', marginTop: 14, justifyContent: 'center', borderRadius: 10}}
                  text={'Add Food'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.showLogFood(key.id)}
              />
              <CreatButton
                  buttonStyle={{marginLeft: 10, flex: 1, height: 40, width: 120, fontSize: 10, alignItems: 'center', backgroundColor: '#d64c33', marginTop: 14, justifyContent: 'center', borderRadius: 10}}
                  text={'Submit Changes'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() =>  this.changeMeal(key.id)}
              />

            </View>
            {/* <style={{flex: 1, marginTop: 5, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}> */}
            <ScrollView >
              {this.generateFoodCard(key.id)}
            </ScrollView>
          </Card>
        )
      }
     })
    
  }


  addMeal() {
    let obj = {};
    obj.name = this.state.mealname;
    obj.date = this.state.date;
    this.actName.current.clear();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.state.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' , requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("created")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      this.setState({mealname: "", date: ""});
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }


  removeMeal(mealID) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.state.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealID, requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("deleted")) {
        Alert.alert("Congratulations!!!", result.message);
       
      } else {
        Alert.alert("OOPS!", result.message)
      }
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  
  }


  static navigationOptions = {
    title: 'Meals',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name={Platform.OS === "ios"?"ios-pizza":"md-pizza" } size={25} color={tintColor}/>
    )
  };

  showLogFood(mealID) {
    this.setState({showmealID: mealID, showLogFood: true});
  }

  hideLogFood(){
    this.setState({showLogFood: false});
    this.updateFromApi();
  }

  

  render() {
    return (
      <ScrollView onScroll={event => { 
        this.setState({yOffset: event.nativeEvent.contentOffset.y});
        }}>
        
          <Text style={styles.sectionHeading}>Meals Summary</Text>
          <Card title="Add Meal" containerStyle={{backgroundColor: '#a1bbd6', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
      
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 11, width: 190}}>
                Meal Time: 
              </Text>
              <DatePicker
                  date={this.state.date}
                  mode="datetime"
                  placeholder="select date"
                  format='MMMM D, YYYY h:mm A'
                  minDate = {new Date(moment().subtract(7,'d'))}
                  maxDate={this.state.currentDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      borderColor: '#86878a',
                      marginLeft: 36,
                      borderRadius: 5
                    },
                    placeholderText: {
                      color: 'black'
                    }
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
              />
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 10, width: 190}}>
                Meal Name:  
              </Text>
              <TextInput 
                    ref={this.actName}
                    style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    placeholder= "Enter Meal Name"
                    placeholderTextColor="#6f7375"
                    onChangeText={(text) => {this.setState({mealname: text})}}
                  />
            </View>
           
            <View style={{flex: 1, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <CreatButton
                  buttonStyle={{flex: 1, height: 40, width: 90, fontSize: 10, alignItems: 'center', backgroundColor: '#e0ac5e', marginTop: 14, justifyContent: 'center', borderRadius: 10}}
                  text={'Use Current Time'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.setCurrentTime()}
              /> 

              {/* <CreatButton
                  buttonStyle={{flex: 1, height: 40,  width: 80, fontSize: 10, alignItems: 'center', backgroundColor: '#bd5ee0', marginTop: 14, marginLeft: 10, justifyContent: 'center', borderRadius: 10}}
                  text={'Add Food'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.showLogFood()}
              /> */}

              <CreatButton
                  buttonStyle={{flex: 1, height: 40,  width: 80, fontSize: 10, alignItems: 'center', backgroundColor: '#68bd6f', marginTop: 14, marginLeft: 10, justifyContent: 'center', borderRadius: 10}}
                  text={'Add Meal'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.addMeal()}
              />  
            
            </View>
          </Card>
          
           {this.generateCard()}
          <LogFood 
            width={350} 
            mealID={this.state.showmealID}
            accesscode={this.state.accesscode} 
            foodlist={this.state.foodlisttolog} 
            height={400} 
            yOffset={this.state.yOffset} 
            show={this.state.showLogFood} 
            hide={() => this.hideLogFood()} 
          />
         
      </ScrollView>
    );
  }


} 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    paragraph: {
      paddingBottom: 10,
      
    },
    story: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      width: '100%',
      padding: 10,
      backgroundColor: 'gray'
    },
    sectionHeading: {
      margin: 8,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#116bd1',
    },
    storyHeading: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    button: {
      display: 'flex',
      flexDirection: 'column',
    },
  });
export default Meals;