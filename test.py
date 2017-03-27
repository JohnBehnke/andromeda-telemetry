from websocket_server import WebsocketServer
import serial
import csv
import thread
import time
import json



# ser = serial.Serial('/dev/cu.usbserial-A601SFE1', 57600) #need to config this





def new_client(client, server):
    server.send_message_to_all("Hey all, a new client has joined us")




if __name__ == "__main__":

    server = WebsocketServer(8081, host='localhost')
    server.run_forever()



    scratch = open('scratch.txt', 'a')
    spacecraft = {
        
        "debug.message" : "",
        "debug.error" :"",
        "debug.phase": "",
        "sci.atg": 0,
        "sci.acclx" : 0.0,
        "sci.accly" : 0.0,
        "sci.acclz" :0.0,
        "sci.magx" :0.0,
        "sci.magy" :0.0,
        "sci.magz" : 0.0,
        "sci.gyrox":  0.0,
        "sci.gyroy" :0.0,
        "sci.gyroz": 0.0,
        "sci.gpsHour": 0.0,
        "sci.gpsMin": 0.0,
        "sci.gpsSec": 0.0,
        "sci.gpsDay": 0.0,
        "sci.gpsMonth": 0.0,
        "sci.gpsYear": 0.0,
        "sci.gpsfix": 0.0,
        "sci.gpsFixQuality": 0.0,
        "sci.gpsLatitude": 0.0,
        "sci.gpsLongitude": 0.0,
        "sci.gpsSpeed": 0.0,
        "sci.gpsAngle": 0.0,
        "sci.gpsSatelites": 0.0,
        "sci.motora": 0.0,
        "sci.motorb" : 0.0
                    
    }
    with open('test.csv', 'rb') as f:
        reader = csv.reader(f)
        for row in reader:
            data_to_parse = row
            scratch.write(''.join(data_to_parse))
            # data_to_parse.strip().split(',')
            if data_to_parse[0] == 'MESSAGE':
                timeStamp = int(data_to_parse[1])
                spacecraft["debug.message"] = data_to_parse[2]
                value = data_to_parse[3]

            if data_to_parse[0] == 'ERROR':
                timeStamp = int(data_to_parse[1])
                spacecraft["debug.error"] = data_to_parse[2]


            if data_to_parse[0] == 'ALT':
                timeStamp = int(data_to_parse[1])
                spacecraft["sci.atg"] = int(data_to_parse[2])

            if data_to_parse[0] == 'ACCEL':
                timeStamp = int(data_to_parse[1])
                spacecraft["sci.acclx"] = float(data_to_parse[2])
                spacecraft["sci.accly"] = float(data_to_parse[3])
                spacecraft["sci.acclz"] = float(data_to_parse[4])

            if data_to_parse[0] == 'MAG':
                timeStamp = int(data_to_parse[1])
                spacecraft["sci.magx"] = float(data_to_parse[2])
                spacecraft["sci.magy"] = float(data_to_parse[3])
                spacecraft["sci.magz"] = float(data_to_parse[4])

            if data_to_parse[0] == 'GYRO':
                timeStamp = int(data_to_parse[1])
                spacecraft["sci.gyroX"] = float(data_to_parse[2])
                spacecraft["sci.gyroY"] = float(data_to_parse[3])
                spacecraft["sci.gyroZ"] = float(data_to_parse[4])

            if data_to_parse[0] == 'GPS':
                timeStamp = int(data_to_parse[1])
                spacecraft["sci.gpsHour"] = float(data_to_parse[2])
                spacecraft["sci.gpsMin"] = float(data_to_parse[3])
                spacecraft["sci.gpsSec"] = float(data_to_parse[4])
                spacecraft["sci.gpsDay"] = float(data_to_parse[5])
                spacecraft["sci.gpsMonth"] = float(data_to_parse[6])
                spacecraft["sci.gpsYear"] = float(data_to_parse[7])
                spacecraft["sci.gpsFix"] = float(data_to_parse[8])
                spacecraft["sci.gpsFixQuality"] = float(data_to_parse[9])
                spacecraft["sci.gpsLatitude"] = float(data_to_parse[10])
                spacecraft["sci.gpsLongitude"] = float(data_to_parse[11])
                spacecraft["sci.gpsSpeed"] = float(data_to_parse[12])
                spacecraft["sci.gpsAngle"] = float(data_to_parse[13])
                # spacecraft["sci.gpsLe"] = float(data_to_parse[14])
                spacecraft["sci.gpsSatelites"] = float(data_to_parse[15])

            if data_to_parse[0] == 'MOTORA':
                timeStamp = int(data_to_parse[1])
                spacecraft["motora"] = float(data_to_parse[2])

            if data_to_parse[0] == 'MOTORB':
                timeStamp = int(data_to_parse[1])
                spacecraft["motorb"] = float(data_to_parse[2])


            if data_to_parse[0] == 'PHASE':
                timeStamp = int(data_to_parse[1])
                spacecraft["debug.phase"] = data_to_parse[2]
            # ws.send(json.dumps(spacecraft))
            server.send_message(json.dumps(spacecraft))
'''
while True:
    data_to_parse = ser.readline();
    scratch.write(data_to_parse)

    data_to_parse.strip().split(',')
    if data_to_parse[0] == 'MESSAGE':
        timeStamp = int(data_to_parse[1])
        messageText = data_to_parse[2]
        value = data_to_parse[3]

    if data_to_parse[0] == 'ERROR':
        timeStamp = int(data_to_parse[1])
        errorMessage = data_to_parse[2]
        altitudeToGround = int(data_to_parse[3])

    if data_to_parse[0] == 'ALT':
        timeStamp = int(data_to_parse[1])
        altitudeToGround = int(data_to_parse[2])

    if data_to_parse[0] == 'ACCEL':
        timeStamp = int(data_to_parse[1])
        accelX = float(data_to_parse[2])
        accelY = float(data_to_parse[3])
        accelZ = float(data_to_parse[4])

    if data_to_parse[0] == 'MAG':
        timeStamp = int(data_to_parse[1])
        magX = float(data_to_parse[2])
        magY = float(data_to_parse[3])
        magZ = float(data_to_parse[4])

    if data_to_parse[0] == 'GYRO':
        timeStamp = int(data_to_parse[1])
        gyroX = float(data_to_parse[2])
        gyroY = float(data_to_parse[3])
        gyroZ = float(data_to_parse[4])

    if data_to_parse[0] == 'GPS':
        timeStamp = int(data_to_parse[1])
        hour = float(data_to_parse[2])
        minutes = float(data_to_parse[3])
        seconds = float(data_to_parse[4])
        day = float(data_to_parse[5])
        month = float(data_to_parse[6])
        year = float(data_to_parse[7])
        fix = float(data_to_parse[8])
        fixQuality = float(data_to_parse[9])
        latitude = float(data_to_parse[10])
        longitude = float(data_to_parse[11])
        speed = float(data_to_parse[12])
        angle = float(data_to_parse[13])
        attitude = float(data_to_parse[14])
        satelites = float(data_to_parse[15])

    if data_to_parse[0] == 'MOTORA':
        timeStamp = int(data_to_parse[1])
        offsetDegrees = float(data_to_parse[2])

    if data_to_parse[0] == 'MOTORB':
        timeStamp = int(data_to_parse[1])
        offsetDegrees = float(data_to_parse[2])


    if data_to_parse[0] == 'PHASE':
        timeStamp = int(data_to_parse[1])
        phase = data_to_parse[2]
'''