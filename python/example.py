import wiiboard
import pygame
import time
import os
import urllib2

os.environ["SDL_VIDEODRIVER"] = "dummy"

def main():
        board = wiiboard.Wiiboard()
        #f = open('wii.dat', 'w')


        #c = zerorpc.Client()
        #c.connect("tcp://127.0.0.1:4242")

        pygame.init()

        address = board.discover()
        board.connect(address) #The wii board must be in sync mode at this time

        time.sleep(0.1)
        board.setLight(True)
        done = False
        reportStep = False
        while (not done):
                time.sleep(0.05)
                for event in pygame.event.get():
                        if event.type == wiiboard.WIIBOARD_MASS:
                                if (event.mass.totalWeight > 10):   #10KG. otherwise you would get alot of useless small events!
                                        reportStep = True
                                        #print "--Mass event--   Total weight: " + `event.mass.totalWeight` + ". Top left: " + `event.mass.topLeft`
                                        #f.write(str(event.mass.totalWeight)+"\n")
                                        #etc for topRight, bottomRight, bottomLeft. buttonPressed and buttonReleased also available but easier to use in seperate event
                                else:
                                    if reportStep:
                                        urllib2.urlopen("http://0.0.0.0:8088/on").read()
                                        print 'step'
                                        #TODO: do send analytics here
                                        reportStep = False
                        elif event.type == wiiboard.WIIBOARD_BUTTON_PRESS:
                                print "Button pressed!"

                        elif event.type == wiiboard.WIIBOARD_BUTTON_RELEASE:
                                print "Button released"
                                done = True

                        #Other event types:
                        #wiiboard.WIIBOARD_CONNECTED
                        #wiiboard.WIIBOARD_DISCONNECTED

        board.disconnect()
        pygame.quit()
        

#Run the script if executed
if __name__ == "__main__":
        main()