int waterSolenoid = D1;
int soapSolenoid = D3;
int lightSensor = A1;
int flushSensor = A2;
bool flushTrigger = true;
int flushSensorValue;
bool lightTrigger = false;
int lightSensorValue;

int waterOn(String args)
{
    digitalWrite(waterSolenoid, HIGH);
    return 200;
}

int waterOff(String args)
{
    digitalWrite(waterSolenoid, LOW);
    return 200;
}

int soapOn(String args)
{
    digitalWrite(soapSolenoid, HIGH);
    return 200;
}

int soapOff(String args)
{
    digitalWrite(soapSolenoid, LOW);
    return 200;
}

void setup()
{
    pinMode(waterSolenoid, OUTPUT);
    pinMode(soapSolenoid, OUTPUT);
    pinMode(lightSensor, INPUT);
    pinMode(flushSensor, INPUT);
    Spark.function("water-on", waterOn);
    Spark.function("water-off", waterOff);
    Spark.function("soap-on", soapOn);
    Spark.function("soap-off", soapOff);
    Spark.variable("flush",&flushSensorValue,INT);
    Spark.variable("light",&lightSensorValue,INT);
}

void loop()
{
    flushSensorValue=analogRead(flushSensor);
    if((flushTrigger)&&(flushSensorValue<2500))
    {
        flushTrigger=false;
        Spark.publish("flushed","flushed!",60,PRIVATE);
    }
    else if((!flushTrigger)&&(flushSensorValue>=2500))
    {
        flushTrigger=true;
    }
    lightSensorValue=analogRead(lightSensor);
    if((lightTrigger)&&(lightSensorValue<2600))
    {
        lightTrigger=false;
        Spark.publish("light-off","",60,PRIVATE);
    }
    else if((!lightTrigger)&&(lightSensorValue>=2600))
    {
        lightTrigger=true;
        Spark.publish("light-on","",60,PRIVATE);
    }
}