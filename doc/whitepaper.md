# Real-Time Traffic Data Visualization 
 White Paper

Revision History
1 AUG 2017, Calvin, Initial Draft

# Background
KMB has a website and mobile application to track bus arrival time. We can improve it by digest such data and visualize it on a map, such that we can see the overall traffic status. Note that we shall not be bounded to KMB, the system should accept other data source as well, and we are not limited to show bus.

# Goal
The goal of this project is to make a portal / platform which fetch data from KMB and process it such that we can estimate buses location and display on Google Map. The bus location should be update and it looks like real time traffic monitor.
As there are about 3920 buses on KMB, we usually don’t display all buses at once (but it looks so fun), we shall provide a filter mechanic on the platform.

# Reference
KMB provide a portal for arrival estimation. http://www.kmb.hk/en/services/eta-main.html
The bus route information, station positions and arrival estimations are returned as ajax/json.

# Other Potential
Once we have a system to display traffic location, we can add more input sources:
- Other bus operator
- Other type of traffic: mini-bus, taxi

# Special Note
KMB data, while accessible from web and app, might have restriction on other purpose. However it is possible to get a license from them in later project stage to use such data.