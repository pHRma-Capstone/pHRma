import csv
import random
import sys
from datetime import datetime, timedelta


CHANCE_OF_NULL =    50      ## 1/CHANCE_OF_NULL for null able fields to be NULL
CHANCE_REFERED_TO=  10      ## 1/CHANCE_REFERED_TO for refered_to field to have entrie
CHANCE_COLAB=       15      ## 1/CHANCE_COLAB for colaborator field to have entrie
NUM_MED_RANGE=      65      ## range from 0 to NUM_MED_RANGE for number of medications
NUM_INT_RANGE=      65      ## range from 0 to NUM_INT_RANGE from number of Interventions
NUMBERDAYS =        30      ## number of days to pass over whole csv file



LINECOUNT =         100     ##  Default number of rows to create
FILENAME = "data"           ##  Default file name
year = 2024                 ##  Default date
month = 1
day = 1
time = " 6:00:00"           ## Time is always this value

## add more entries of specific atrubute to incress its chance of being selected Example: type_d = ["MHC","MHC","MHC","MHC","MHC-PED", "MHC-EXT"]
type_d = ["MHC","MHC-PED", "MHC-EXT"]
bool_d = ["TRUE", "FALSE"]
status_d = ["Completed","Completed","Completed","Completed","Completed", "Not Done", "Abbreviated Note", "In-Progress", "Investigating"]
location_d = ["PCU", "MUPC", "Other", "ER", "ICU"]
duration_d = ["<1 Minute", "1- 5 Minutes", "6-15 Minutes", "16-30 Minutes", "31-60 Minutes", ">1 Hour"]

## add name as seen fit, names based off of original FakeData1
names_d = [["Brian Wilson","Kernighan CPhT"], ["Dennis Macalistair","Ritchie CPhT"], ["Thompson CPhT","Kenneth Lane"], ["Gosling CPhT","James Arthur"]]

##header for file 
header = ["Type","Time","Last Name","First Name","Last Name - Collaborating","First Name - Collaborating","Status", "Location","Admit Orders Placed","Number of Medications","Number of Interventions","Intervention - Missing Meds","Intervention - Patient Not Taking","Intervention - Incorrect Medication","Intervention - Incorrect Dose","Intervention - Incorrect Frequency","Intervention - Incorrect Route","Intervention - Allergies Clarified","Intervention - Vaccination Documented","Duration","Additional Information","Last Name - Referred To",	"First Name - Referred To"]



##creates a single row in the csv file
def create_row(rowdata:datetime):
    row = []
    ##Type
    row.append(type_d[random.randrange(0,3)])

    ##time
    row.append(rowdata.strftime("%Y-%m-%d %H:%M:%S"))

    ##name
    name = names_d[random.randrange(0,len(names_d))]
    row.append(name[1])
    row.append(name[0])

    #Last Name - Collaborating
    #First Name - Collaborating
    #random chance of having colaborator
    if(random.randrange(1,CHANCE_COLAB) == 1):
        name = names_d[random.randrange(0,len(names_d))]
        row.append(name[1])
        row.append(name[0])
    
    else:
        ## no colaborator
        row.append("")
        row.append("")

    ## status
    row.append(status_d[random.randrange(0, len(status_d))])

    ## location
    row.append(location_d[random.randrange(0, len(location_d))])

    ## Admit Orders Placed
    ## random chance of being null
    if(random.randrange(1, CHANCE_OF_NULL) == 1):
         row.append("")
    else:
        row.append(bool_d[random.randrange(0,len(bool_d))])
        
    ##Number of Medications
    row.append(random.randrange(1, NUM_MED_RANGE))

    ##Number of Interventions
    row.append(random.randrange(1, NUM_INT_RANGE))

    ##Number of Interventions all the way to duration
    
    for i in range(1,9):

        if(random.randrange(0, CHANCE_OF_NULL) == 1):
            row.append("")
        else:
            row.append(bool_d[random.randrange(0,len(bool_d))])

    ##duration
    row.append(duration_d[random.randrange(0, len(duration_d))])

    ##comments
    row.append("")

    #Last Name - Referred To
    #First Name - Referred To
    if(random.randrange(1,CHANCE_REFERED_TO) == 1):
        name = names_d[random.randrange(0,len(names_d))]
        row.append(name[1])
        row.append(name[0])
    
    else:
        ## no refered to
        row.append("")
        row.append("")


    return row


if __name__ == "__main__":

    #if name not give set default
    if(len(sys.argv) >= 2):
        FILENAME = sys.argv[1]

        
    #set number of files to create
    if(len(sys.argv) >= 3):
        if(str.isdigit(sys.argv[2])):
            LINECOUNT = int(sys.argv[2])

    ##if 4 arg specifed, enter date
    if(len(sys.argv) >= 4):
    
        print("Enter date for data to start at\n")
        i1 = input("year: ")
        i2 = input("month: ")
        i3 = input("day: ")

        if(str.isnumeric(i1) and str.isnumeric(i2) and str.isnumeric(i3)):
            year = int(i1)
            month = int(i2)
            day = int(i3)
        else:
            print("invalid input for date")



    filename = FILENAME + ".csv"


    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=",",quoting=csv.QUOTE_NONE)

        writer.writerow(header)

        date = datetime(year,month,day,6)

        for i in range(0,LINECOUNT):
            writer.writerow(create_row(date))

            if(i % ((LINECOUNT) // NUMBERDAYS) == 0): 
                date = date + timedelta(days= 1)




