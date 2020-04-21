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
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";

class LogFood extends React.Component {
    constructor(props) {
        super(props);
        this.actName = React.createRef();
        this.actCalories = React.createRef();
        this.actCarbohydrates = React.createRef();
        this.actProtein = React.createRef();
        this.actFat = React.createRef();
        this.state = {
          addedlist: this.props.foodlist,
          foodname: "",
          foodcalories: 0,
          foodprotein: 0,
          foodcarbo: 0,
          foodfat: 0,
          changeName: "",
          changeCalorie: 0,
          changeProtein: 0,
          changeCarbo: 0,
          changeFat: 0,
          updatefoodlist: [],
        }
      }
    
   
    
    
    
  
    addFood() {
      let obj = {};
      obj.name = this.state.foodname;
      obj.calories = this.state.foodcalories;
      obj.protein = this.state.foodprotein;
      obj.carbohydrates = this.state.foodcarbo;
      obj.fat = this.state.foodfat;
      this.actName.current.clear();
      this.actCalories.current.clear();
      this.actCarbohydrates.current.clear();
      this.actProtein.current.clear();
      this.actFat.current.clear();



      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", this.props.accesscode);
      
      
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(obj),
        redirect: 'follow', 
      };
      
      fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealID + '/foods' , requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.message.includes("created")) {
          Alert.alert("Congratulations!!!", result.message)
        } else {
          Alert.alert("OOPS!", result.message)
        };
      })
      .catch(error => this.setState({errorMessage: "hellosdasd"}));



      this.setState({foodname: "", foodcalories: 0, foodprotein: 0, foodcarbo: 0, foodfat: 0});


    }


    

    render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);
      
      return (
        
        <View style={{position: 'absolute'}}>
          <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, top: this.props.yOffset, backgroundColor: 'black', opacity: 0.55}}>
            </View>
          </TouchableWithoutFeedback>
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: this.props.yOffset + screenHeight/8, backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Add Food for Meal</Text>
            <CreatButton buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <ScrollView style={{flex: 1}}>  
              <Card containerStyle={{backgroundColor: '#a1bbd6', borderRadius: 10}} dividerStyle={{backgroundColor: 'black'}}>
                <View  style={{marginLeft: 2, marginRight: 2, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{ marginTop: 10, width: 60}}>
                    Name:  
                  </Text>
                  <TextInput 
                        ref={this.actName}
                        style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                        placeholder= "Enter Food Name"
                        placeholderTextColor="#6f7375"
                        onChangeText={(text) => {this.setState({foodname: text})}}
                      />
                  
                </View>
                <View  style={{marginLeft: 2, marginRight: 2, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{ marginTop: 10, width: 75}}>
                    Calories:  
                  </Text>
                  <TextInput 
                        ref={this.actCalories}
                        style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                        placeholder= "Enter Food Calories"
                        placeholderTextColor="#6f7375"
                        onChangeText={(text) => {this.setState({foodcalories: text})}}
                      />
                  
                </View>
                <View  style={{marginLeft: 2, marginRight: 2, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
                  
                  <Text style={{marginTop: 10, width: 60}}>
                    Protein:  
                  </Text>
                  <TextInput 
                        ref={this.actProtein}
                        style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                        placeholder= "Enter Food Protein"
                        placeholderTextColor="#6f7375"
                        onChangeText={(text) => {this.setState({foodprotein: text})}}
                      />
                </View>
                <View  style={{marginLeft: 2, marginRight: 2, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{ marginTop: 10, width: 105}}>
                    Carbohydrates:  
                  </Text>
                  <TextInput 
                        ref={this.actCarbohydrates}
                        style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                        placeholder= "Enter Food Carbohydrates"
                        placeholderTextColor="#6f7375"
                        onChangeText={(text) => {this.setState({foodcarbo: text})}}
                      />
                  
                </View>
                <View  style={{marginLeft: 2, marginRight: 2, marginTop: -5, flexDirection: 'row', flexWrap: 'wrap'}}>
                   <Text style={{marginLeft: 6, marginTop: 10, width: 35}}>
                    Fat:  
                  </Text>
                  <TextInput 
                        ref={this.actFat}
                        style={{ color: '#be03fc',fontWeight: 'bold', height: 40, width: 150,textAlign:'center', alignItems: 'center', borderColor: '#8e8f94', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                        placeholder= "Enter Food Fat"
                        placeholderTextColor="#6f7375"
                        onChangeText={(text) => {this.setState({foodfat: text})}}
                      />
                </View>

                <View style={{flex: 1, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <CreatButton
                      buttonStyle={{flex: 1, height: 40,  width: 120, fontSize: 10, alignItems: 'center', backgroundColor: '#bd5ee0', marginTop: 14, marginLeft: 15, justifyContent: 'center', borderRadius: 10}}
                      text={'Add Food'} 
                      textStyle={{color: "#4d4a43", fontSize: 12, fontWeight: 'bold'}}
                      onPress={() => this.addFood()}
                  />      
                </View>               
              </Card>

            </ScrollView>
          
          </View>
          
        </View>
      )
    }
    return (<View></View>)
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

export default LogFood;
