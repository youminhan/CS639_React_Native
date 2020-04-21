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
import currentDay from './currentDay';
import Meals from './Meals';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";



class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.actName = React.createRef();
    this.actDuration = React.createRef();
    this.actCalories = React.createRef();
    this.state = {
      username: "",
      password: "",
      userProfile: {},
      userActivity: [],
      totalWorkCalorie: "",
      totalCalorie: "",
      accesscode: "",
      errorMessage: "",
      showProfile: false,
      currentDate: "",
      date:"",
      activityname:"",
      activityCalorie: 0,
      aciivityDuration: 0,
      changeDate: "",
      changeCalorie: -1,
      changeDuration: -1,
      changeName: "",
      activityTime: {}
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
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    
    
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };

    
    
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.screenProps.username, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({userProfile: result});
        this.setState({errorMessage: result.message});
      })
      .then(fetch('https://mysqlcs639.cs.wisc.edu/activities', requestOptions)
        .then(response2 => response2.json())
        .then(result2 => {
          
          this.setState({userActivity: result2.activities});

          let tempobj = {};
          for (let tempact of result2.activities) {
            tempobj[tempact.id] = tempact.date;
          }
          this.setState({activityTime: tempobj});
          this.setState({errorMessage: result2.message});
          this.setState({currentDate: new Date()});
        })
        .catch(error => this.setState({errorMessage: "hellosdasd"}))
      )
      .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }

  setCurrentTime() {
    this.setState({date: moment().format('MMMM D, YYYY h:mm A')});
  }
  

  addActivity() {
    let obj = {};
    obj.name = this.state.activityname;
    obj.date = this.state.date;
    obj.calories = this.state.activityCalorie;
    obj.duration = this.state.aciivityDuration;
    this.actName.current.clear();
    this.actCalories.current.clear();
    this.actDuration.current.clear();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' , requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("created")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      this.setState({activityname: "", date: "", activityCalorie: 0, aciivityDuration: 0});
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }
  
  changeActivity(activityID) {
    let obj = {};
    if (this.state.changeCalorie !== -1) {
      obj.calories = this.state.changeCalorie;
    }
    if (this.state.changeDuration !== -1) {
      obj.duration = this.state.changeDuration;
    }
    if (this.state.changeName !== "") {
      obj.name = this.state.changeName;
    }
    if (this.state.changeDate !== "") {
      obj.date = this.state.changeDate;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + activityID , requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("updated")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      this.setState({changeCalorie: -1, changeDate: "", changeName: "", changeDuration: -1});
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }



  generateCard() {

    let activitylist = this.state.userActivity;
    return activitylist.map((key, index) => {
      if (moment(key.date).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
        return (
          
          <Card key={key.id}  containerStyle={{backgroundColor: '#aae3cd', borderRadius: 10}}>
            <View>
               <Text style ={{fontWeight: 'bold'}}>Activity Id: {key.id}</Text>
               <CreatButton buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.removeActivity(key.id)}/>
            </View>
            <View style={{marginLeft: 5,alignItems: 'center', justifyContent: 'center', marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
            
            <DatePicker
                  style={{ marginTop: 11, width: 300}}
                  date = {moment(this.state.activityTime[key.id])}
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
                    
                    let currTime = Object.assign({}, this.state.activityTime);
                    currTime[key.id] = new Date(date);
                    this.setState({activityTime: currTime});
                    this.setState({changeDate: date}
                  )}}
              />
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              

              <Text style={{marginTop: 5, width: 70}}>Duration: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 70,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {`${key.duration}`}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeDuration: text})}}
              />
              <Text style={{marginTop: 5, marginLeft: 30, width: 70}}>Calories: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 70,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {`${key.calories}`}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeCalorie: text})}}
              />

              
              
            </View>
            <View style={{marginLeft: 5, marginRight: 5, marginTop: -5, marginBottom: -10, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{marginTop: 6, width: 50}}>Name: </Text>
              <TextInput 
                style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                defaultValue= {key.name}
                placeholderTextColor="#6f7375"
                onChangeText={(text) => {this.setState({changeName: text})}}
              />
              <CreatButton
                  buttonStyle={{height: 30, display: 'flex', width: 150, fontSize: 15, alignItems: 'center', justifyContent: 'center' ,backgroundColor: '#d64c33', marginLeft: 35, justifyContent: 'center', borderRadius: 10}}
                  text={'Submit Changes'} 
                  textStyle={{color: "#0a0a0a", fontSize: 16, fontWeight: 'bold'}}
                  onPress={() => this.changeActivity(key.id)}
              /> 
            </View>
          </Card>
        )
      }
    })
  }

  removeActivity(activityid) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow', 
    };
    
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + activityid, requestOptions)
    .then(response => response.json())
    .then(result => {
      this.setState({errorMessage: result.message});
      if (result.message.includes("deleted")) {
        Alert.alert("Congratulations!!!", result.message)
      } else {
        Alert.alert("OOPS!", result.message)
      }
      {this.updateFromApi()}
    })
    .catch(error => this.setState({errorMessage: "hellosdasd"}));
  
  }

  static navigationOptions = {
      title: 'Activity',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name={Platform.OS === "ios"?"ios-basketball":"md-basketball" } size={25} color={tintColor}/>
      )
  };
  render() {
    return (
        <ScrollView>  
          <Text style={styles.sectionHeading}>Activity Summary</Text>
          <Card title="Add Activty" containerStyle={{backgroundColor: '#a1bbd6', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
            <View  style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 11, width: 190}}>
                Activity Time: 
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
                Activity Name:  
              </Text>
              <TextInput 
                    ref={this.actName}
                    style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    placeholder= "Enter Activity Name"
                    placeholderTextColor="#6f7375"
                    onChangeText={(text) => {this.setState({activityname: text})}}
                  />
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 10, width: 190}}>
                Activity Duration:  
              </Text>
              <TextInput 
                    ref={this.actDuration}
                    style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    placeholder= "Enter Activity Duration"
                    placeholderTextColor="#6f7375"
                    onChangeText={(text) => {this.setState({aciivityDuration: text})}}
                  />
            </View>
            <View  style={{marginLeft: 5, marginRight: 5, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={{ marginTop: 10, width: 190}}>
                Activity Calories:  
              </Text>
              <TextInput 
                    ref={this.actCalories}
                    style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    placeholder= "Enter Activity Calories"
                    placeholderTextColor="#6f7375"
                    onChangeText={(text) => {this.setState({activityCalorie: text})}}
                  />
            </View>
            
            <View style={{flex: 1, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <CreatButton
                  buttonStyle={{flex: 1, height: 40, width: 120, fontSize: 10, alignItems: 'center', backgroundColor: '#e0ac5e', marginTop: 14, justifyContent: 'center', borderRadius: 10}}
                  text={'User Current Time'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.setCurrentTime()}
              /> 

              <CreatButton
                  buttonStyle={{flex: 1, height: 40,  width: 120, fontSize: 10, alignItems: 'center', backgroundColor: '#bd5ee0', marginTop: 14, marginLeft: 15, justifyContent: 'center', borderRadius: 10}}
                  text={'Add Activity'} 
                  textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                  onPress={() => this.addActivity()}
              />      
            </View>
          </Card>
          {this.generateCard()}
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
    

export default Activity;
