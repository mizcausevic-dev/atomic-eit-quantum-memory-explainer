# Publishing card

SEO title: Atomic EIT Quantum Memory: What Happens to the Signal Envelope

Subtitle: A 34-second sectional plate of electromagnetically induced transparency storage, and the four things it refuses to draw.

Slug: atomic-eit-quantum-memory-signal-envelope

Meta description: How an atomic EIT quantum memory maps a signal envelope onto a collective spin wave and retrieves it. Group velocity, the dark-state polariton, and why the photon is not parked in the cell.

Canonical: publish this URL on Medium, then point any mirror at that Medium URL.

Tags: Quantum Computing, Physics, Science, Quantum Communication, Education

Primary keyword: atomic EIT quantum memory

Live plate: https://mizcausevic-dev.github.io/atomic-eit-quantum-memory-explainer/

---

# Atomic EIT Quantum Memory: What Happens to the Signal Envelope

**A weak optical pulse goes into a cold atomic ensemble and, a short time later, a weaker pulse comes out. The interesting part is everything the cell is doing in between.**

An atomic EIT quantum memory stores that pulse by electromagnetically induced transparency. The signal field and a classical control field address a three-level lambda system. Inside the ensemble the signal envelope slows, shortens in space, and is mapped onto a collective spin wave. Restoring the control field maps the coherence back into the forward optical mode. The vacuum speed of light stays c the whole time.

That is the entire device story. The rest of this piece is how to read it without the usual shortcuts: a glowing photon frozen in midair, a perfect echo, a copy left behind, or a storage time with no end. Those pictures are easy to animate and wrong.

Kinetic Gain published a 34-second sectional plate of the sequence. It runs at 30 frames per second, 1,020 frames, indexed 0 to 1019. Hardware is drawn as metal and glass. Cyan, gold, and violet are labels for the signal pathway, the control field, and the atomic coherence. They are not emission colors. You can scrub any frame and get the same picture twice.

Play it here: https://mizcausevic-dev.github.io/atomic-eit-quantum-memory-explainer/

## What is an atomic EIT quantum memory?

EIT is electromagnetically induced transparency. In the ideal lambda atom there are two long-lived ground states, call them |g> and |s>, and one excited state, |e>. The signal, or probe, couples |g> to |e>. A stronger classical control field couples |s> to |e>.

On two-photon resonance those two pathways to |e> cancel. The atom is driven into a dark state that barely occupies the excited level, so a resonant signal that would otherwise be absorbed can pass. That window in the absorption spectrum is narrow. A narrow transparency window comes with a steep dispersion curve. Steep dispersion is what slows the envelope.

The object that propagates is a dark-state polariton, the quasiparticle introduced by Fleischhauer and Lukin in Physical Review Letters in 2000. In the ideal model it is a single excitation shared by the optical field and a collective spin coherence of the ensemble:

```
vg = c * cos^2 theta
cos theta = Omega_c / sqrt(Omega_c^2 + g^2 N)
Psi = cos theta * E - sin theta * sqrt(N) * S
```

Omega_c is the control Rabi frequency. g is the atom-field coupling. N is the number of atoms in the mode. E is the signal envelope. S is the collective spin wave. Theta is the mixing angle. When the control is strong, theta is small, the polariton is mostly light, and the group velocity sits closer to c. When the control is lowered, theta grows, the polariton becomes mostly spin coherence, and the group velocity falls.

None of those symbols on the plate is a fitted laboratory number. The drawing uses an illustrative ratio of g times the square root of N to Omega_c, large enough that the spatial compression is visible in a 34-second film. A real ensemble is far denser than the hundred-odd dots in the cutaway, and a real optical depth is a measured quantity. The plate does not invent one.

## Why does the signal envelope slow down?

Outside the cell the envelope travels at the vacuum group velocity. Call that c. At two-photon resonance the ideal EIT medium has a refractive index near 1, so the phase of the carrier is not crawling. What changes is the slope of the dispersion. The envelope's group velocity is

```
vg = c * cos^2 theta
```

which is smaller than c whenever the control is finite and the ensemble coupling is not zero. The carrier cycles themselves are omitted from the animation on purpose. Optical frequencies are hundreds of terahertz. Drawing them would be a strobe, not an explanation. The plate labels that omission as time compression.

Watch the incoming pulse in the film between 10 and 17 seconds. In vacuum it is a long cyan envelope. Once the center crosses into the ensemble, the same excitation occupies a much shorter length. The height of the drawing does not spike to "concentrate the energy." Width tracks the illustrative group-velocity ratio. Amplitude is a separate, qualitative loss cue. Entry into a real medium already throws some of the excitation away: finite optical depth, mode mismatch, residual absorption in the wings of the window. The plate shows a small drop and refuses a percentage.

This is the correction hidden in the phrase "slow light." The vacuum speed of light is a property of empty space. EIT does not edit it. EIT edits the dispersion the envelope sees inside this medium, and only while the control field holds the window open.

## Is the light actually stopped?

Popular accounts call the next step stopped light. The laboratory papers are more careful, and they should be. Liu, Dutton, Behroozi, and Hau demonstrated storage in a sodium Bose-Einstein condensate in Nature in 2001. Phillips, Fleischhauer, Mair, Walsworth, and Lukin demonstrated it in a warm rubidium vapor the same year. In both cases the control field was turned down and the optical pulse left the forward mode. What remained was atomic coherence.

On the plate that handoff sits between 17 and 25 seconds. The gold control beam, already on before the signal arrives, ramps down. The cyan edge of the envelope fades. A violet profile with the same spatial shape brightens in its place and then holds still. Atoms inside that profile pick up a phase that varies along the cell. That phase pattern is the spin wave. It is shared. It is not a bead of light sitting on one atom.

Group velocity of the polariton reaches zero because the photonic fraction reaches zero. There is nothing left in the optical mode to propagate. Turning the control off does not pin a photon in place the way a clamp pins a wire. The excitation has been mapped.

The film holds that state only briefly, and the violet contrast sags a little while it does. Ground-state coherence decays. Magnetic gradients, atomic motion, and collisions all set a clock. The plate labels the clock and does not print a laboratory lifetime, because a lifetime without a device, a field, and a temperature is fiction.

## What happens to the excitation during storage?

One excitation goes in. The polariton is the bookkeeping. While the envelope is still moving inside the cell, both fractions are present and they move together: a photonic part that lets the shape propagate, and a spin part that already holds most of the amplitude when g times the square root of N is larger than Omega_c. Lowering Omega_c transfers the balance. The shape that was the compressed envelope becomes the shape of S(z).

That is why the retrieval can be directional. A collective coherence with a well-defined wavevector radiates back into the forward optical mode when the control returns. A single atom's private coherence would not rebuild the same spatial mode. The ensemble is the memory, not a box the photon waits in.

The plate draws about 150 dots so you can see the phase ticks. Atom number and spacing are diagrammatic. The magnetic shield around the cell is shown cut away because ground-state coherence cares about field uniformity. It is not a catalog part, and the wall thickness is not a specification.

## Why is retrieval not a copy?

From 25 seconds to the end, the control field comes back. Theta shrinks. The violet profile gives the shape back to a cyan envelope, the envelope crawls to the exit, and outside the cell it stretches again toward its vacuum length. A direction marker sits on the axis only while the group velocity is nonzero.

The outgoing envelope is visibly dimmer than the incoming one. A comparison chart in the corner draws the input silhouette and the retrieved silhouette on the same unscaled axes. The weaker trace is a cue, not a measured efficiency. Real retrieval loses excitation to decoherence during the hold, to the finite optical depth of the medium, and to light that leaves in modes other than the forward mode. Whatever does not return is lost. It is not a second copy kept in the cell for later.

That distinction matters if you care about quantum communication. A memory in a repeater chain is there to hold an unknown quantum state until the next link is ready. Copying an unknown state is forbidden. Mapping it, waiting, and mapping it back is allowed, and it is lossy. An animation that leaves a ghost pulse in the cell and a full pulse at the output has drawn a cloner. This one does not.

The last second of the film is held still: control on, ensemble idle, retrieved envelope parked in the forward output mode, accuracy lines on screen. A detector can characterize that mode. The memory step itself was the mapping, not the click of the detector.

## What does the 34-second plate show?

The camera moves once in each section, and the previous section stays in frame so the cause is still visible.

- 0 to 5 seconds. The bench, the signal source, the control source, and a longitudinal section of the ensemble cell. The near wall is drawn dashed. Nothing is disassembled.
- 5 to 10 seconds. The lambda diagram, labeled as a level diagram and not a spatial zoom. The cell remains below it. The control field is already on. The signal envelope enters from the left as the camera eases back.
- 10 to 17 seconds. The envelope compresses inside the medium. A schematic EIT window shows absorption with a narrow dip and a steep dispersion curve. Axes are unscaled.
- 17 to 25 seconds. The control falls. The moving polariton becomes a stationary spin wave. The formula card shows the ideal polariton relations.
- 25 to 34 seconds. The control returns. The spin wave maps back to a weaker forward envelope. The closing view is locked.

Space plays and pauses. Arrow keys step 15 frames. Shift plus an arrow steps one frame. If the browser asks for reduced motion, playback starts paused on the closing frame.

Frame 700 is the storage hold, if you want the single still that carries the argument: control off, photonic fraction gone, violet spin wave inside the ensemble, no cyan object left behind.

## What should you not take from the animation?

The plate is a consolidated teaching schematic. It is not a certified physics reference, a laser-safety guide, or a build sheet. Do not align a lab from it. Do not quote a storage time, an efficiency, an optical depth, or a Rabi frequency from it. There isn't one to quote.

Four boundaries are printed on the closing frame because they are the ones people miss:

1. The vacuum speed of light stays c. Group velocity is the envelope, inside the medium.
2. Storage is a spin wave. No photon is held in the cell as a bright object.
3. The excitation is mapped. A second copy is not left behind.
4. Retrieval is partial, and the hold is temporary.

Colors are a legend. The control beam's angle is opened up so the two paths can be distinguished. Envelope height is enlarged against the cell so the shape can be read. The width ratio, while the pulse is inside, follows the illustrative group velocity. Slow motion relative to a laboratory pulse is labeled, and no microsecond scale is claimed.

If you need numbers, go to the papers. The model relation is Fleischhauer and Lukin, Physical Review Letters 84, 5094 (2000). The first storage experiments are Liu, Dutton, Behroozi, and Hau, Nature 409, 490 (2001), and Phillips, Fleischhauer, Mair, Walsworth, and Lukin, Physical Review Letters 86, 783 (2001). Those experiments have apparatuses, temperatures, and efficiencies. This film is the mechanism with the costume jewelry removed.

## FAQ

**Does EIT quantum memory stop a photon?**
It maps the signal envelope onto a collective spin wave by lowering the control field. The group velocity of the polariton goes to zero. The photon is not sitting in the cell as a localized, glowing object.

**Does slow light change the speed of light?**
The vacuum speed c is unchanged. The envelope group velocity inside the ensemble drops because the EIT window has steep dispersion.

**Is the stored state a copy of the pulse?**
One excitation is transferred from the optical mode to the spin wave and, on retrieval, back to the forward mode. The cell does not keep a spare.

**Why is the output weaker?**
Finite optical depth, residual absorption, mode mismatch, and decoherence during the hold all remove excitation. The plate shows that loss qualitatively and does not claim an efficiency.

**How long does the memory last?**
As long as the ground-state coherence lasts in that device, under that magnetic environment. The animation labels the decay and does not print a lifetime.

**What do the colors mean?**
Cyan is the signal pathway, gold is the control field, violet is coherence and state. They are overlays on ordinary metal and glass.

## A last look

The useful picture is modest. A control field opens a narrow window. A signal envelope slows and shortens inside an ensemble. Lowering the control parks the shape in a collective spin wave. Raising the control hands a weaker envelope back to the forward mode. c never moved. Nothing was copied. Nothing glowed in place.

The plate is here when you want to watch that sequence instead of imagining it: https://mizcausevic-dev.github.io/atomic-eit-quantum-memory-explainer/

Source and the accuracy note: https://github.com/mizcausevic-dev/atomic-eit-quantum-memory-explainer
