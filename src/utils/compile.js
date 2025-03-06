export const processAtoms = (atoms) => {
  const atomsOutput = {};
  atoms.forEach((atom) => {
    atomsOutput[atom.id] = atom;
  });
  return atomsOutput;
};

export const processMolecules = (molecules, atomsOutput) => {
  const moleculesOutput = {};
  molecules.forEach((molecule) => {
    moleculesOutput[molecule.id] = molecule;
  });

  for (const molecule in moleculesOutput) {
    const atomsData = moleculesOutput[molecule].atoms;
    const atomsDataOutput = {};
    if (Array.isArray(atomsData)) {
      atomsData.forEach((atom, index) => {
        // Handle both legacy string references and new object structure with id
        const atomId = typeof atom === "string" ? atom : atom.id;
        const atomObj = atomsOutput[atomId];

        if (atomObj) {
          const key = atom.name || atomObj.name || `atom_${index}`;
          atomsDataOutput[key] = {
            ...atomObj,
            name: atom.name || atomObj.name, // Use name if available
            order: index,
            visibility: atom.visibility !== false,
            translation_key: atom.translation_key || "",
          };
        }
      });
    }
    moleculesOutput[molecule].atoms = atomsDataOutput;
  }

  return moleculesOutput;
};

export const processMolecule = (molecule, atomsOutput) => {
  let { atoms } = molecule;
  let atomOutput = {};
  if (Array.isArray(atoms)) {
    atoms.forEach((atom, index) => {
      // Handle both legacy string references and new object structure with id
      const atomId = typeof atom === "string" ? atom : atom.id;
      const atomObj = atomsOutput[atomId];

      if (atomObj) {
        const key = atom.name || atomObj.name || `atom_${index}`;
        atomOutput[key] = {
          ...atomObj,
          name: atom.name || atomObj.name, // Use name if available
          order: index,
          visibility: atom.visibility !== false,
          translation_key: atom.translation_key || "",
        };
      }
    });
  }

  return { ...molecule, atoms: atomOutput };
};

export const processOrganisms = (organisms, moleculesOutput) => {
  const organismsOutput = {};
  organisms.forEach((organism) => {
    organismsOutput[organism.id] = organism;
  });

  for (const organism in organismsOutput) {
    const moleculesData = organismsOutput[organism].composition;
    const moleculesDataOutput = [];
    moleculesData.forEach((molecule, index) => {
      if (molecule.component_type == "molecule") {
        moleculesDataOutput.push({
          ...molecule,
          ...moleculesOutput[molecule.id],
          order: index,
          properties: {
            "molecule-id": molecule.id,
            ...molecule.properties,
            ...moleculesOutput[molecule.id]?.properties,
          },
          visibility: molecule.visibility || false,
        });
      } else if (molecule.component_type == "organism") {
        moleculesDataOutput.push({
          ...molecule,
          order: index,
          visibility: molecule.visibility || false,
        });
      }
    });
    organismsOutput[organism].composition = moleculesDataOutput;
  }

  return organismsOutput;
};

export const compileOrganismData = (widget_data) => {
  try {
    const { organism, molecule, atom } = widget_data.data.components;
    const atomsOutput = processAtoms(atom);
    const moleculesOutput = processMolecules(molecule, atomsOutput);
    const organismsOutput = processOrganisms(organism, moleculesOutput);

    return organismsOutput;
  } catch (error) {
    console.error(error);
  }
};
