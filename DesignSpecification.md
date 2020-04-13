# Design Specification
## Problem
Ask any person if they feel like they have enough money, and there is a good chance the answer will be “no”, regardless of how much money they make. There are many ways to make more money, but that appears to be only part of the problem. Usually, when people suggest changing how you spend money, the first solution that comes to mind is budgeting; sit down, write out a tedious and detailed plan with categories your grandparents used and decide how much you want to allot to each one over a year or month. This approach is justified by giving the user a detailed look at the numbers, but “the trouble people have with budgeting isn’t about numbers, but about behavior.” The classical budgeting solution is front-loaded, abstract, antiquated, and unapproachable. We want to re-imagine the solution space to require minimal onboarding, to meet modern user needs, and to encourage users to achieve goals that feel attainable, immediate and concrete.

## Solution
We envision an entry form in which users can quickly and manually add transactions including the amount spent, date of transaction, and description. For the onboarding process, user will enter their daily budget goal into the goal text field. Each successive entry will be totaled. The “status” of the system(how much money you have left to spend) is the budget to date minus the total expenses entered. Successive days will roll over the status from the previous day, continuously accumulating leftover budget room or overages in the budget. As the form and representations will be text-oriented, the interface will aim to be straightforward and simplistic. The “status” visualization is what will prompt user behavior, and will be located at the top of the screen, followed right below by the entry form. Between viewing statuses and entering transactions, the design is all captured under one screen.
 * INSERT LOW FIDELITY PIC

The web app's interface layout is responsive to different screen sizes, but prioritize the mobile experience, where the entry form and status are viewable without scrolling on a standard mobile screen. 

*  INSERT  back end algorithm
