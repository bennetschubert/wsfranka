# wsfranka
Node JS Application for controlling a Franka Emika Panda Robot through Websocket API

# Anforderungen an Steuerung der Task-Auswahl

## Aktueller Stand:
- Die auszuführenden Schritte werden Tasks genannt
- Modbus TCP Kommunikation zwischen Panda und S7 1200 findet bereits statt
- Aktueller Übergabebereich liegt bei 32 Bit für Eingänge und 32 Bit für Ausgänge
- Eingänge können gelesen werden
- Ausgänge können gelesen und geschrieben werden
- Derzeit werden Eingänge aufgrund erschwerter Informationsübergabe nicht
genutzt
- Ausgänge dienen zur Kommunikation
- Raspberry kann über die Schnittstelle des Robot-Network die Modbusdaten
auslesen und verarbeiten
- Steuerung der Tasks ist über das Robot-Network möglich
- Erster Versuch, eine Task über den RaspberryPi mittels Modbus-Signal zu
steuern war erfolgreich
2DO
- Bitweise soll eine Ansteuerung einer definierten Task erfolgen
- Identifikation der Task über den Task-Namen

## Ausgangsbelegung zur Robotersteuerung
| Ausgangsbit | Taskname |
|---|----|
| 17 | Grundstellung |
| 18 | Schraube M8x45 greifen |
| 19 | Schraube M8x40 greifen |
| 20 | Schraube M8x35 greifen |
| 21 | Spannscheibe – Mutter |
| 22 | Mutter – Spannscheibe |
| 23 | Spannscheibe nach Magazin 1 |
| 24 | Spannscheibe nach Magazin 2 |
| 25 | Spannscheibe nach Magazin 3 |
| 26 | Spannscheibe nach Magazin 4 |
| 27 | Spannscheibe nach Magazin 5 |
| 28 | Spannscheibe nach Magazin 6 |
| 29 | unlock<sup>1</sup>|
| 30 | lock<sup>2</sup>|
| 31 | ready<sup>3</sup>|


### Hinweise
<sup>1</sup> Unlock ist keine Task, sondern eine Systemfunktion, die die Gelenke des Roboters entsperrt. Sie muss
nach jedem Roboterstart ausgeführt werden.

<sup>2</sup> Lock ist keine Task, sondern eine Systemfunktion. Sie soll steuerbar sein, damit bei Systemwartung
oder Ähnlichem ein sicherer Zustand hergestellt werden kann. Eventuell ist es die gleiche Varbiable wie
Unlock.

<sup>3</sup> Ready ist keine Task, sondern eine Meldung, dass der Roboter Aufgaben übernehmen kann. Die LEDs
leuchten in diesem Moment blau.

## Weitere Hinweise

- Bedingungen für Robotersteuerung sollen von der S7 Steuerung bestimmt
werden, sie ist der Systemmaster
- Das Steuerungsskript auf dem Raspberry soll mit Autostart ausgeführt werden
- Bei Verbindungsabbruch muss ein erneuter Verbindungsaufbau erfolgen
- 32 Gesamtbits stehen für die Steuerung zur Verfügung, davon werden 15 für die
direkte Robotersteuerung genutzt (siehe Tabelle), 17 Bits stehen dann noch für
die Kommunikation zwischen SPS und Roboter zur Verfügung
