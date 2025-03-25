# Gravity Simulator: Mathematical Foundations

A 3D gravitational physics simulator for learning linear algebra and differential equations through celestial mechanics.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundation with Examples](#mathematical-foundation-with-examples)
   - [Vector Mathematics](#vector-mathematics)
   - [Linear Algebra Applications](#linear-algebra-applications)
   - [Matrix Transformations](#matrix-transformations)
3. [Physics Equations and Examples](#physics-equations-and-examples)
   - [Gravitational Force Calculations](#gravitational-force-calculations)
   - [Orbital Mechanics](#orbital-mechanics)
4. [Numerical Integration with Examples](#numerical-integration-with-examples)
   - [Euler Method](#euler-method)
   - [Verlet Integration](#verlet-integration)
   - [Runge-Kutta 4 Method](#runge-kutta-4-method)
5. [Collision Physics](#collision-physics)
6. [Linear Algebra in 3D Visualization](#linear-algebra-in-3d-visualization)
7. [Step-by-Step Simulation Example](#step-by-step-simulation-example)
8. [Learning Exercises](#learning-exercises)

## Introduction

This gravity simulator serves as a practical tool for learning linear algebra, vector calculus, and differential
equations through the lens of gravitational physics. By exploring how celestial bodies interact in 3D space, students
can gain intuition for abstract mathematical concepts and see their real-world applications.

## Mathematical Foundation with Examples

### Vector Mathematics

The simulator is built on vector operations in 3D space. Let's examine the key operations with concrete examples based
on two celestial bodies:

**Sample Data:**

- Earth position: $[149.6 \times 10^9, 0, 0]$ meters (149.6 million km from the Sun)
- Mars position: $[227.9 \times 10^9, 0, 0]$ meters (227.9 million km from the Sun)
- Earth velocity: $[0, 29.78 \times 10^3, 0]$ m/s (orbital velocity)
- Mars velocity: $[0, 24.07 \times 10^3, 0]$ m/s (orbital velocity)

#### 1. Vector Subtraction (Displacement Vector)

The displacement vector from Earth to Mars:

$$\vec{r} = \vec{r}_\text{Mars} - \vec{r}_\text{Earth}$$
$$\vec{r} = [227.9 \times 10^9, 0, 0] - [149.6 \times 10^9, 0, 0]$$
$$\vec{r} = [78.3 \times 10^9, 0, 0] \text{ meters}$$

This vector points from Earth toward Mars along the x-axis.

#### 2. Vector Magnitude (Distance)

The distance between Earth and Mars:

$$|\vec{r}| = \sqrt{\vec{r} \cdot \vec{r}} = \sqrt{r_1^2 + r_2^2 + r_3^2}$$
$$|\vec{r}| = \sqrt{(78.3 \times 10^9)^2 + 0^2 + 0^2}$$
$$|\vec{r}| = 78.3 \times 10^9 \text{ meters (78.3 million km)}$$

#### 3. Unit Vector (Direction)

The unit vector pointing from Earth to Mars:

$$\hat{r} = \frac{\vec{r}}{|\vec{r}|}$$
$$\hat{r} = \frac{[78.3 \times 10^9, 0, 0]}{78.3 \times 10^9}$$
$$\hat{r} = [1, 0, 0]$$

This is a unit vector along the positive x-axis.

#### 4. Vector Addition (Adding Velocities)

If we needed to add a small correction to Earth's velocity:

$$\vec{v}_{new} = \vec{v}_{current} + \vec{v}_{correction}$$
$$\vec{v}_{new} = [0, 29.78 \times 10^3, 0] + [100, 0, 50]$$
$$\vec{v}_{new} = [100, 29.78 \times 10^3, 50] \text{ m/s}$$

#### 5. Dot Product (Work or Projection)

The dot product between Earth's velocity and the Earth-Mars displacement vector:

$$\vec{v}_\text{Earth} \cdot \vec{r} = v_1r_1 + v_2r_2 + v_3r_3$$
$$\vec{v}_\text{Earth} \cdot \vec{r} = 0 \times (78.3 \times 10^9) + (29.78 \times 10^3) \times 0 + 0 \times 0$$
$$\vec{v}_\text{Earth} \cdot \vec{r} = 0$$

This equals zero because Earth's velocity is perpendicular to the displacement vector, meaning Earth is not moving
directly toward or away from Mars.

#### 6. Cross Product (Area or Perpendicular Vector)

The cross product between Earth's velocity and the Earth-Mars displacement vector:

$$\vec{v}_\text{Earth} \times \vec{r} = [v_2r_3 - v_3r_2, v_3r_1 - v_1r_3, v_1r_2 - v_2r_1]$$
$$\vec{v}_\text{Earth} \times \vec{r} = [(29.78 \times 10^3) \times 0 - 0 \times 0, 0 \times (78.3 \times 10^9) - 0 \times 0, 0 \times 0 - (29.78 \times 10^3) \times (78.3 \times 10^9)]$$
$$\vec{v}_\text{Earth} \times \vec{r} = [0, 0, -2.33 \times 10^{15}]$$

This points in the negative z-direction with magnitude equal to the area of the parallelogram formed by the two vectors.

### Linear Algebra Applications

#### 1. State Vectors

The complete state of a celestial body can be represented as a state vector:

$$
\vec{s} = \begin{bmatrix}
\text{position}_x \\
\text{position}_y \\
\text{position}_z \\
\text{velocity}_x \\
\text{velocity}_y \\
\text{velocity}_z
\end{bmatrix}
$$

For Earth:

$$
\vec{s}_\text{Earth} = \begin{bmatrix}
149.6 \times 10^9 \\
0 \\
0 \\
0 \\
29.78 \times 10^3 \\
0
\end{bmatrix}
$$

#### 2. Linear Systems in Physics Calculations

The n-body gravitational problem creates a system of differential equations that can be expressed in matrix form:

For a simplified 2-body problem (Sun and Earth), the acceleration of Earth is:

$$\vec{a}_\text{Earth} = \frac{\vec{F}}{m_\text{Earth}} = \frac{G \times m_\text{Sun} \times m_\text{Earth}}{r^2} \times \frac{\vec{r}}{r} \times \frac{1}{m_\text{Earth}} = \frac{G \times m_\text{Sun}}{r^2} \times \hat{r}$$

With:

- $G = 6.67430 \times 10^{-11} \text{ m}^3/\text{kg} \cdot \text{s}^2$
- $m_\text{Sun} = 1.989 \times 10^{30} \text{ kg}$
- $r = 149.6 \times 10^9 \text{ meters}$
- $\hat{r} = [-1, 0, 0]$ (unit vector pointing from Earth to Sun)

$$\vec{a}_\text{Earth} = \frac{6.67430 \times 10^{-11} \times 1.989 \times 10^{30}}{(149.6 \times 10^9)^2} \times [-1, 0, 0]$$
$$\vec{a}_\text{Earth} = 5.93 \times 10^{-3} \times [-1, 0, 0]$$
$$\vec{a}_\text{Earth} = [-5.93 \times 10^{-3}, 0, 0] \text{ m/s}^2$$

This acceleration vector points toward the Sun, keeping Earth in orbit.

### Matrix Transformations

#### 1. Scaling Matrix

To visualize astronomical distances, we scale them by a factor of $10^{-9}$:

$$
S = \begin{bmatrix}
10^{-9} & 0 & 0 & 0 \\
0 & 10^{-9} & 0 & 0 \\
0 & 0 & 10^{-9} & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

Applying this to Earth's position:

$$\text{position}_\text{scaled} = S \times \text{position}_\text{original}$$
$$\begin{bmatrix} x' \\ y' \\ z' \\ 1 \end{bmatrix} = S \times \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$$
$$\begin{bmatrix} 149.6 \\ 0 \\ 0 \\ 1 \end{bmatrix} = S \times \begin{bmatrix} 149.6 \times 10^9 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$

The scaled position is $[149.6, 0, 0]$ units, which is manageable for visualization.

#### 2. Camera View Matrix

The camera view matrix transforms world coordinates to camera coordinates:

$$
V = \begin{bmatrix}
r_{11} & r_{12} & r_{13} & -\vec{r}_1 \cdot \vec{eye} \\
r_{21} & r_{22} & r_{23} & -\vec{r}_2 \cdot \vec{eye} \\
r_{31} & r_{32} & r_{33} & -\vec{r}_3 \cdot \vec{eye} \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

Where:

- $\vec{r}_1, \vec{r}_2, \vec{r}_3$ are the right, up, and forward basis vectors
- $\vec{eye}$ is the camera position

For a camera at $[0, 50, 200]$ looking at the origin:

$$
V \approx \begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & -50 \\
0 & 0 & 1 & -200 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

## Physics Equations and Examples

### Gravitational Force Calculations

#### 1. Newton's Law of Universal Gravitation

**Vector form with sample calculation:**

Force between the Sun and Earth:

$$\vec{F} = G \times \frac{m_1 \times m_2}{|\vec{r}|^2} \times \frac{\vec{r}}{|\vec{r}|}$$

With:

- $G = 6.67430 \times 10^{-11} \text{ m}^3/\text{kg} \cdot \text{s}^2$
- $m_\text{Sun} = 1.989 \times 10^{30} \text{ kg}$
- $m_\text{Earth} = 5.972 \times 10^{24} \text{ kg}$
- $\vec{r} = [-149.6 \times 10^9, 0, 0]$ (vector from Sun to Earth)
- $|\vec{r}| = 149.6 \times 10^9$ meters

$$\vec{F} = 6.67430 \times 10^{-11} \times \frac{1.989 \times 10^{30} \times 5.972 \times 10^{24}}{(149.6 \times 10^9)^2} \times \frac{[-149.6 \times 10^9, 0, 0]}{149.6 \times 10^9}$$
$$\vec{F} = 6.67430 \times 10^{-11} \times \frac{1.189 \times 10^{55}}{2.238 \times 10^{22}} \times [-1, 0, 0]$$
$$\vec{F} = 3.55 \times 10^{22} \times [-1, 0, 0]$$
$$\vec{F} = [-3.55 \times 10^{22}, 0, 0] \text{ newtons}$$

This is the gravitational force vector pulling Earth toward the Sun.

#### 2. Net Force on a Body

For a three-body system (Sun, Earth, Mars), the net force on Earth is:

$$\vec{F}_\text{net} = \vec{F}_\text{Sun→Earth} + \vec{F}_\text{Mars→Earth}$$

From our previous calculation:

- $\vec{F}_\text{Sun→Earth} = [-3.55 \times 10^{22}, 0, 0] \text{ N}$

For the Mars-Earth force:

- $\vec{r}_\text{Mars→Earth} = [-78.3 \times 10^9, 0, 0] \text{ m}$
- $|\vec{r}_\text{Mars→Earth}| = 78.3 \times 10^9 \text{ m}$
- $m_\text{Mars} = 6.39 \times 10^{23} \text{ kg}$

$$\vec{F}_\text{Mars→Earth} = 6.67430 \times 10^{-11} \times \frac{6.39 \times 10^{23} \times 5.972 \times 10^{24}}{(78.3 \times 10^9)^2} \times \frac{[-78.3 \times 10^9, 0, 0]}{78.3 \times 10^9}$$
$$\vec{F}_\text{Mars→Earth} = 6.67430 \times 10^{-11} \times \frac{3.81 \times 10^{48}}{6.13 \times 10^{21}} \times [-1, 0, 0]$$
$$\vec{F}_\text{Mars→Earth} = 4.16 \times 10^{16} \times [-1, 0, 0]$$
$$\vec{F}_\text{Mars→Earth} = [-4.16 \times 10^{16}, 0, 0] \text{ newtons}$$

The net force:
$$\vec{F}_\text{net} = [-3.55 \times 10^{22}, 0, 0] + [-4.16 \times 10^{16}, 0, 0]$$
$$\vec{F}_\text{net} = [-3.55 \times 10^{22}, 0, 0] \text{ newtons}$$

The Mars-Earth force is negligible compared to the Sun-Earth force.

#### 3. Acceleration Calculation

Earth's acceleration due to the net force:

$$\vec{a} = \frac{\vec{F}_\text{net}}{m_\text{Earth}}$$
$$\vec{a} = \frac{[-3.55 \times 10^{22}, 0, 0]}{5.972 \times 10^{24}}$$
$$\vec{a} = [-5.94 \times 10^{-3}, 0, 0] \text{ m/s}^2$$

### Orbital Mechanics

#### 1. Circular Orbital Velocity

The velocity needed for a circular orbit:

$$v_\text{orbit} = \sqrt{\frac{G \times M}{r}}$$

For Earth:
$$v_\text{orbit} = \sqrt{\frac{6.67430 \times 10^{-11} \times 1.989 \times 10^{30}}{149.6 \times 10^{9}}}$$
$$v_\text{orbit} = \sqrt{\frac{13.26 \times 1.989 \times 10^{30}}{149.6 \times 10^{9}}}$$
$$v_\text{orbit} = \sqrt{\frac{1.76 \times 10^{21}}{149.6 \times 10^{9}}}$$
$$v_\text{orbit} = \sqrt{1.176 \times 10^{10}}$$
$$v_\text{orbit} = 29,780 \text{ m/s} \approx 29.8 \text{ km/s}$$

This matches Earth's actual orbital velocity.

#### 2. Orbital Period (Kepler's Third Law)

The period of a celestial body's orbit:

$$T = 2\pi \times \sqrt{\frac{r^3}{G \times M}}$$

For Earth:
$$T = 2\pi \times \sqrt{\frac{(149.6 \times 10^9)^3}{6.67430 \times 10^{-11} \times 1.989 \times 10^{30}}}$$
$$T = 2\pi \times \sqrt{\frac{3.35 \times 10^{30}}{1.33 \times 10^{20}}}$$
$$T = 2\pi \times \sqrt{2.52 \times 10^{10}}$$
$$T = 2\pi \times 5.02 \times 10^5$$
$$T = 3.15 \times 10^6 \text{ seconds} = 365.2 \text{ days}$$

This is Earth's orbital period (one year).

## Numerical Integration with Examples

Let's track Earth's position and velocity over a short time interval using different integration methods.

**Initial conditions:**

- Earth position: $[149.6 \times 10^9, 0, 0] \text{ m}$
- Earth velocity: $[0, 29.78 \times 10^3, 0] \text{ m/s}$
- Acceleration due to Sun: $[-5.93 \times 10^{-3}, 0, 0] \text{ m/s}^2$
- Time step (dt): 3600 seconds (1 hour)

### Euler Method

$$\vec{v}(t+dt) = \vec{v}(t) + \vec{a}(t) \times dt$$
$$\vec{x}(t+dt) = \vec{x}(t) + \vec{v}(t) \times dt$$

After one time step:

$$\vec{v}_\text{new} = [0, 29.78 \times 10^3, 0] + [-5.93 \times 10^{-3}, 0, 0] \times 3600$$
$$\vec{v}_\text{new} = [0, 29.78 \times 10^3, 0] + [-21.35, 0, 0]$$
$$\vec{v}_\text{new} = [-21.35, 29.78 \times 10^3, 0] \text{ m/s}$$

$$\vec{x}_\text{new} = [149.6 \times 10^9, 0, 0] + [0, 29.78 \times 10^3, 0] \times 3600$$
$$\vec{x}_\text{new} = [149.6 \times 10^9, 0, 0] + [0, 1.07 \times 10^8, 0]$$
$$\vec{x}_\text{new} = [149.6 \times 10^9, 1.07 \times 10^8, 0] \text{ meters}$$

After this first hour, Earth has moved slightly along the y-axis and gained a small negative x-component to its
velocity, beginning to curve its path.

### Verlet Integration

$$\vec{x}(t+dt) = \vec{x}(t) + \vec{v}(t) \times dt + \frac{1}{2} \times \vec{a}(t) \times dt^2$$
$$\vec{v}(t+dt/2) = \vec{v}(t) + \frac{1}{2} \times \vec{a}(t) \times dt$$
$$\vec{a}(t+dt) = \text{calculate\_acceleration}(\vec{x}(t+dt))$$
$$\vec{v}(t+dt) = \vec{v}(t+dt/2) + \frac{1}{2} \times \vec{a}(t+dt) \times dt$$

Step 1 - Position update and half-step velocity:
$$\vec{x}_\text{new} = [149.6 \times 10^9, 0, 0] + [0, 29.78 \times 10^3, 0] \times 3600 + \frac{1}{2} \times [-5.93 \times 10^{-3}, 0, 0] \times 3600^2$$
$$\vec{x}_\text{new} = [149.6 \times 10^9, 0, 0] + [0, 1.07 \times 10^8, 0] + [-3.84 \times 10^4, 0, 0]$$
$$\vec{x}_\text{new} \approx [149.6 \times 10^9, 1.07 \times 10^8, 0] \text{ meters}$$

$$\vec{v}_\text{half} = [0, 29.78 \times 10^3, 0] + \frac{1}{2} \times [-5.93 \times 10^{-3}, 0, 0] \times 3600$$
$$\vec{v}_\text{half} = [0, 29.78 \times 10^3, 0] + [-10.67, 0, 0]$$
$$\vec{v}_\text{half} = [-10.67, 29.78 \times 10^3, 0] \text{ m/s}$$

Step 2 - Recalculate acceleration at new position:
$$\vec{r}_\text{new} = [-149.6 \times 10^9, -1.07 \times 10^8, 0] \text{ meters (from Sun to new Earth position)}$$
$$|\vec{r}_\text{new}| = \sqrt{(149.6 \times 10^9)^2 + (1.07 \times 10^8)^2} \approx 149.6 \times 10^9 \text{ meters (distance barely changed)}$$
$$\vec{a}_\text{new} \approx [-5.93 \times 10^{-3}, -4.23 \times 10^{-6}, 0] \text{ m/s}^2 \text{ (small y-component added due to position change)}$$

Step 3 - Complete velocity update:
$$\vec{v}_\text{new} = [-10.67, 29.78 \times 10^3, 0] + \frac{1}{2} \times [-5.93 \times 10^{-3}, -4.23 \times 10^{-6}, 0] \times 3600$$
$$\vec{v}_\text{new} = [-10.67, 29.78 \times 10^3, 0] + [-10.67, -7.61, 0]$$
$$\vec{v}_\text{new} = [-21.34, 29.78 \times 10^3, 0] \text{ m/s (y-component change is negligible)}$$

The Verlet method provides a more accurate trajectory by incorporating acceleration into the position update and
recalculating forces at intermediate positions.

### Runge-Kutta 4 Method

RK4 evaluates the derivatives at four points to get a weighted average:

$$\vec{k}_1 = dt \times f(t, \vec{y})$$
$$\vec{k}_2 = dt \times f(t + dt/2, \vec{y} + \vec{k}_1/2)$$
$$\vec{k}_3 = dt \times f(t + dt/2, \vec{y} + \vec{k}_2/2)$$
$$\vec{k}_4 = dt \times f(t + dt, \vec{y} + \vec{k}_3)$$
$$\vec{y}(t+dt) = \vec{y}(t) + \frac{\vec{k}_1 + 2\vec{k}_2 + 2\vec{k}_3 + \vec{k}_4}{6}$$

Where:

- $\vec{y}$ is the state vector [position, velocity]
- $f$ is the derivative function returning [velocity, acceleration]

For brevity, we'll just outline the process without the full calculation:

1. $\vec{k}_1$: Evaluate derivatives at the initial state

   - $\vec{v}_1 = \text{initial velocity} = [0, 29.78 \times 10^3, 0]$
   - $\vec{a}_1 = \text{initial acceleration} = [-5.93 \times 10^{-3}, 0, 0]$

2. $\vec{k}_2$: Evaluate at $t+dt/2$ using $\vec{k}_1$

   - Position at midpoint = initial position + velocity × dt/2
   - Recalculate acceleration at this midpoint

3. $\vec{k}_3$: Evaluate at $t+dt/2$ using $\vec{k}_2$

   - Different midpoint based on $\vec{k}_2$ values
   - Recalculate acceleration again

4. $\vec{k}_4$: Evaluate at $t+dt$ using $\vec{k}_3$

   - Position at end of step based on $\vec{k}_3$
   - Recalculate acceleration one more time

5. Combine with weights:
   - New position = initial position + $(\vec{v}_1 + 2\vec{v}_2 + 2\vec{v}_3 + \vec{v}_4)/6 \times dt$
   - New velocity = initial velocity + $(\vec{a}_1 + 2\vec{a}_2 + 2\vec{a}_3 + \vec{a}_4)/6 \times dt$

This provides a more accurate trajectory by sampling the derivatives at multiple points within the time step.

## Collision Physics

When two bodies collide, we use conservation of momentum:

**Example: Earth-Mars Collision**

Initial conditions:

- Earth: mass = $5.972 \times 10^{24}$ kg, velocity = $[0, 29.78 \times 10^3, 0]$ m/s
- Mars: mass = $6.39 \times 10^{23}$ kg, velocity = $[0, 24.07 \times 10^3, 0]$ m/s

Total momentum before collision:
$$\vec{p}_\text{total} = m_\text{Earth} \times \vec{v}_\text{Earth} + m_\text{Mars} \times \vec{v}_\text{Mars}$$
$$\vec{p}_\text{total} = 5.972 \times 10^{24} \times [0, 29.78 \times 10^3, 0] + 6.39 \times 10^{23} \times [0, 24.07 \times 10^3, 0]$$
$$\vec{p}_\text{total} = [0, 1.779 \times 10^{29}, 0] + [0, 1.538 \times 10^{28}, 0]$$
$$\vec{p}_\text{total} = [0, 1.933 \times 10^{29}, 0] \text{ kg} \cdot \text{m/s}$$

Combined mass after collision:
$$m_\text{combined} = m_\text{Earth} + m_\text{Mars} = 5.972 \times 10^{24} + 6.39 \times 10^{23} = 6.611 \times 10^{24} \text{ kg}$$

Velocity after collision (from conservation of momentum):
$$\vec{v}_\text{combined} = \frac{\vec{p}_\text{total}}{m_\text{combined}}$$
$$\vec{v}_\text{combined} = \frac{[0, 1.933 \times 10^{29}, 0]}{6.611 \times 10^{24}}$$
$$\vec{v}_\text{combined} = [0, 2.924 \times 10^4, 0] \text{ m/s}$$

The combined object would have a velocity of about 29.24 km/s.

## Linear Algebra in 3D Visualization

### Scaling and Normalization

Astronomical distances are too large to visualize directly. We use scaling matrices to make them manageable:

$$\text{position}_\text{scaled} = \text{position}_\text{original} \times \text{SCALE\_FACTOR}$$

For Jupiter's position (778.6 × 10⁹ meters from the Sun):
$$\text{position}_\text{scaled} = [778.6 \times 10^9, 0, 0] \times 10^{-9} = [778.6, 0, 0] \text{ units}$$

### Camera View Matrix Calculation

If we want to view the solar system from a point (200, 100, 300) looking at the origin:

1. Calculate the camera's forward vector:
   $$\vec{forward} = \text{normalize}(\vec{target} - \vec{eye})$$
   $$\vec{forward} = \text{normalize}([0, 0, 0] - [200, 100, 300])$$
   $$\vec{forward} = \text{normalize}([-200, -100, -300])$$
   $$\vec{forward} = [-0.53, -0.27, -0.80]$$

2. Calculate the camera's right vector (using world up = [0, 1, 0]):
   $$\vec{right} = \text{normalize}(\vec{world\_up} \times \vec{forward})$$
   $$\vec{right} = \text{normalize}([0, 1, 0] \times [-0.53, -0.27, -0.80])$$
   $$\vec{right} = \text{normalize}([0.80, 0, -0.53])$$
   $$\vec{right} = [0.83, 0, -0.55]$$

3. Calculate the camera's up vector:
   $$\vec{up} = \vec{forward} \times \vec{right}$$
   $$\vec{up} = [-0.53, -0.27, -0.80] \times [0.83, 0, -0.55]$$
   $$\vec{up} = [0.15, -0.96, 0.22]$$

4. Construct the view matrix:

   $$
   \text{view\_matrix} = \begin{bmatrix}
   \text{right.x} & \text{right.y} & \text{right.z} & -\vec{right} \cdot \vec{eye} \\
   \text{up.x} & \text{up.y} & \text{up.z} & -\vec{up} \cdot \vec{eye} \\
   \text{forward.x} & \text{forward.y} & \text{forward.z} & -\vec{forward} \cdot \vec{eye} \\
   0 & 0 & 0 & 1
   \end{bmatrix}
   $$

   Which gives:

   $$
   \text{view\_matrix} = \begin{bmatrix}
   0.83 & 0 & -0.55 & -166.0 \\
   0.15 & -0.96 & 0.22 & -111.0 \\
   -0.53 & -0.27 & -0.80 & 374.2 \\
   0 & 0 & 0 & 1
   \end{bmatrix}
   $$

## Step-by-Step Simulation Example

Let's track Earth's orbit around the Sun for one day (24 hours) with 1-hour steps:

**Initial conditions:**

- Sun mass: $1.989 \times 10^{30}$ kg, position: [0, 0, 0], fixed
- Earth mass: $5.972 \times 10^{24}$ kg
- Initial position: $[149.6 \times 10^9, 0, 0]$ m
- Initial velocity: $[0, 29.78 \times 10^3, 0]$ m/s
- Time step: 3600 seconds (1 hour)
- Steps: 24 (1 day)

  Using the Verlet integrator:

Hour 0:

- Position: $[149.6 \times 10^9, 0, 0]$ m
- Velocity: $[0, 29.78 \times 10^3, 0]$ m/s
- Acceleration: $[-5.93 \times 10^{-3}, 0, 0]$ m/s²

Hour 1:

- Position: $[149.6 \times 10^9, 1.07 \times 10^8, 0]$ m
- Velocity: $[-21.34, 29.78 \times 10^3, 0]$ m/s
- Acceleration: $[-5.93 \times 10^{-3}, -4.23 \times 10^{-6}, 0]$ m/s²

Hour 2:

- Position: $[149.6 \times 10^9 - 7.68 \times 10^4, 2.14 \times 10^8, 0]$ m
- Velocity: $[-42.68, 29.78 \times 10^3, 0]$ m/s

...and so on.

After 24 hours:

- Position: $[149.59 \times 10^9, 2.57 \times 10^9, 0]$ m
- The Earth has moved about 2.57 million km along its orbit
- Earth's position vector has rotated by about 0.98 degrees

This shows Earth's elliptical orbit around the Sun, completing a full 360° revolution in approximately 365.25 days.

## Implementation Details

Let's examine how these mathematical concepts are implemented in the code:

### Gravitational Force Calculation

```javascript
export function calculateGravitationalForce(body1, body2, G) {
    // Calculate distance vector between bodies
    const dx = body2.position[0] - body1.position[0];
    const dy = body2.position[1] - body1.position[1];
    const dz = body2.position[2] - body1.position[2];

    // Calculate squared distance (for efficiency)
    const distanceSquared = dx * dx + dy * dy + dz * dz;

    // Prevent division by zero and enforce minimum distance
    // Use a minimum distance based on the sum of the radii to prevent extreme forces
    const minDistanceSquared = Math.pow(body1.radius + body2.radius, 2) * 1.5;
    const effectiveDistanceSquared = Math.max(distanceSquared, minDistanceSquared);

    // Calculate distance (magnitude)
    const distance = Math.sqrt(effectiveDistanceSquared);

    // Calculate force magnitude using Newton's Law of Universal Gravitation
    const forceMagnitude = G * (body1.mass * body2.mass) / effectiveDistanceSquared;

    // Calculate normalized direction vector
    const directionX = dx / distance;
    const directionY = dy / distance;
    const directionZ = dz / distance;

    // Return force vector (magnitude * direction)
    return [
        forceMagnitude * directionX,
        forceMagnitude * directionY,
        forceMagnitude * directionZ
    ];
}
```

This implementation:

1. Calculates the displacement vector between two bodies
2. Computes the distance squared (optimization to avoid square root)
3. Enforces a minimum distance to prevent numerical instability
4. Calculates the force magnitude using Newton's formula
5. Computes the unit direction vector
6. Returns the force vector as magnitude × direction

### Matrix Implementation for Integration

Let's consider the mathematical formulation of the Verlet integrator. In linear algebra terms, the Verlet method can be
represented as:

$$
\begin{bmatrix}
\vec{x}(t+\Delta t) \\
\vec{v}(t+\Delta t) \\
\vec{a}(t+\Delta t)
\end{bmatrix} =
\begin{bmatrix}
1 & \Delta t & \frac{\Delta t^2}{2} \\
0 & 1 & \frac{\Delta t}{2} \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
\vec{x}(t) \\
\vec{v}(t) \\
\vec{a}(t)
\end{bmatrix} +
\begin{bmatrix}
0 \\
\frac{\Delta t}{2} \vec{a}(t+\Delta t) \\
\vec{f}(t+\Delta t) - \vec{a}(t)
\end{bmatrix}
$$

Where:

- $\vec{x}$ is position
- $\vec{v}$ is velocity
- $\vec{a}$ is acceleration
- $\vec{f}$ is the new acceleration calculated at the new position
- $\Delta t$ is the time step

This matrix formulation shows how the Verlet method is a second-order approximation, making it more stable than the
first-order Euler method.

## Error Analysis in Numerical Integration

The error properties of the different integrators can be analyzed mathematically:

### Euler Method

- Local truncation error: $O(\Delta t^2)$
- Global truncation error: $O(\Delta t)$
- Stability region: Limited

The error per step in the Euler method is proportional to $\Delta t^2$, but these errors accumulate, resulting in a
global error proportional to $\Delta t$. This makes the Euler method less suitable for long-term simulations.

Mathematical representation of the error:
$$\vec{x}(t+\Delta t) = \vec{x}(t) + \Delta t \vec{v}(t) + \frac{\Delta t^2}{2}\vec{a}(t) + O(\Delta t^3)$$

The Euler method only uses the first two terms, introducing an error of order $\Delta t^2$ at each step.

### Verlet Method

- Local truncation error: $O(\Delta t^4)$
- Global truncation error: $O(\Delta t^2)$
- Stability region: Much larger than Euler

Mathematical representation of the error:
$$\vec{x}(t+\Delta t) = \vec{x}(t) + \Delta t \vec{v}(t) + \frac{\Delta t^2}{2}\vec{a}(t) + \frac{\Delta t^3}{6}\frac{d\vec{a}}{dt}(t) + O(\Delta t^4)$$

The Verlet method includes the $\Delta t^2$ term and implicitly accounts for the $\Delta t^3$ term, resulting in a much
smaller error.

### Runge-Kutta 4 Method

- Local truncation error: $O(\Delta t^5)$
- Global truncation error: $O(\Delta t^4)$
- Stability region: Excellent

The RK4 method uses a weighted average of four evaluations to approximate the solution more accurately. It effectively
includes terms up to $\Delta t^4$ in the Taylor series expansion, resulting in a local error of order $\Delta t^5$.

## Energy Conservation Analysis

One way to verify the accuracy of a numerical integrator is to check how well it conserves energy in a closed system.
For a gravitational system, the total energy should remain constant:

$$E_\text{total} = E_\text{kinetic} + E_\text{potential} = \text{constant}$$

$$E_\text{kinetic} = \frac{1}{2}mv^2$$

$$E_\text{potential} = -\frac{GMm}{r}$$

For a system with the Sun and Earth:

- Sun mass ($M$): $1.989 \times 10^{30}$ kg
- Earth mass ($m$): $5.972 \times 10^{24}$ kg
- Initial distance ($r$): $149.6 \times 10^9$ m
- Initial velocity ($v$): $29.78 \times 10^3$ m/s
- $G = 6.67430 \times 10^{-11}$ m³/kg·s²

$$E_\text{kinetic} = \frac{1}{2} \times 5.972 \times 10^{24} \times (29.78 \times 10^3)^2 = 2.65 \times 10^{33} \text{ J}$$

$$E_\text{potential} = -\frac{6.67430 \times 10^{-11} \times 1.989 \times 10^{30} \times 5.972 \times 10^{24}}{149.6 \times 10^9} = -5.30 \times 10^{33} \text{ J}$$

$$E_\text{total} = 2.65 \times 10^{33} - 5.30 \times 10^{33} = -2.65 \times 10^{33} \text{ J}$$

The negative total energy indicates a bound orbit (elliptical rather than parabolic or hyperbolic).

After running the simulation for one day with different integrators, we would find:

- Euler: Total energy might change by ~0.1%
- Verlet: Total energy might change by ~0.001%
- RK4: Total energy might change by ~0.0001%

This demonstrates the superior energy conservation properties of the Verlet and RK4 methods compared to Euler.

## Linear Algebra Learning Exercises

1. **Vector Calculation Exercise**: Calculate the gravitational force vector between:

   - The Sun at [0, 0, 0] with mass $1.989 \times 10^{30}$ kg
   - Jupiter at $[778.6 \times 10^9, 0, 0]$ with mass $1.898 \times 10^{27}$ kg

   The gravitational force is:
   $$\vec{F} = G \times \frac{m_\text{Sun} \times m_\text{Jupiter}}{r^2} \times \hat{r}$$

   Where:

   - $G = 6.67430 \times 10^{-11}$ m³/kg·s²
   - $r = 778.6 \times 10^9$ m
   - $\hat{r} = [-1, 0, 0]$ (unit vector pointing from Jupiter to Sun)

   Calculate the force vector and compare it to the force between the Sun and Earth.

2. **Matrix Transformation Exercise**: Apply a scaling and rotation matrix to transform Earth's position. Use a scale
   factor of $10^{-9}$ and a rotation of 45° around the z-axis.

   Create the scaling matrix:

   $$
   S = \begin{bmatrix}
   10^{-9} & 0 & 0 & 0 \\
   0 & 10^{-9} & 0 & 0 \\
   0 & 0 & 10^{-9} & 0 \\
   0 & 0 & 0 & 1
   \end{bmatrix}
   $$

   Create the rotation matrix for 45° around z-axis:

   $$
   R_z(45°) = \begin{bmatrix}
   \cos(45°) & -\sin(45°) & 0 & 0 \\
   \sin(45°) & \cos(45°) & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1
   \end{bmatrix} = \begin{bmatrix}
   0.707 & -0.707 & 0 & 0 \\
   0.707 & 0.707 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1
   \end{bmatrix}
   $$

   The combined transformation matrix is:
   $$T = R_z \times S$$

   Apply this to Earth's position $[149.6 \times 10^9, 0, 0]$ and compute the result.

3. **System of Equations Exercise**: Set up the system of linear equations representing the positions and velocities of
   the Earth-Moon system after one time step.

   Using the Verlet method:
   $$\vec{x}_\text{Earth}(t+\Delta t) = \vec{x}_\text{Earth}(t) + \vec{v}_\text{Earth}(t) \times \Delta t + \frac{1}{2} \times \vec{a}_\text{Earth}(t) \times \Delta t^2$$
   $$\vec{v}_\text{Earth}(t+\Delta t) = \vec{v}_\text{Earth}(t) + \frac{1}{2} \times (\vec{a}_\text{Earth}(t) + \vec{a}_\text{Earth}(t+\Delta t)) \times \Delta t$$

   Similar equations apply for the Moon. Write out the full system of equations, including the gravitational
   interactions between the Sun, Earth, and Moon.

4. **Numerical Integration Comparison**: Track the position of Venus over 10 days using all three integration methods
   and compare the results.

   Use these initial conditions:

   - Venus position: $[108.2 \times 10^9, 0, 0]$ m
   - Venus velocity: $[0, 35.02 \times 10^3, 0]$ m/s
   - Venus mass: $4.8675 \times 10^{24}$ kg
   - Sun mass: $1.989 \times 10^{30}$ kg
   - Time step: 1 hour

   Compare the final positions and velocities from each method, as well as the conservation of energy.

5. **Orbital Parameters Calculation**: Use linear algebra to calculate the semi-major axis, eccentricity, and orbital
   period of Mars using its position and velocity vectors.

   Given:

   - Mars position: $[227.9 \times 10^9, 0, 0]$ m
   - Mars velocity: $[0, 24.07 \times 10^3, 0]$ m/s
   - Sun mass: $1.989 \times 10^{30}$ kg
   - $G = 6.67430 \times 10^{-11}$ m³/kg·s²

   Calculate:

   - Specific angular momentum: $\vec{h} = \vec{r} \times \vec{v}$
   - Eccentricity vector: $\vec{e} = \frac{\vec{v} \times \vec{h}}{GM_\text{Sun}} - \frac{\vec{r}}{|\vec{r}|}$
   - Semi-major axis: $a = \frac{h^2}{GM_\text{Sun}(1-e^2)}$
   - Orbital period: $T = 2\pi \sqrt{\frac{a^3}{GM_\text{Sun}}}$

These exercises demonstrate how linear algebra concepts are applied in gravitational physics simulations, providing
practical context for abstract mathematical principles.
