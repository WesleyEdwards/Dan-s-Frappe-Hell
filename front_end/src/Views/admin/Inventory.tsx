import { Container, Stack, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import CreateIngredient from "../../components/CreateIngredient";
import { DFHeader } from "../../components/DFHeader";
import IngredientsEdit, {
  IngredientRow,
} from "../../components/IngredientsEdit";
import ViewIngredientDialogue from "../../components/ViewIngredientDialogue";

export const Inventory: FC = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<
    IngredientRow | undefined
  >();

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const saveChangedIngredient = (ingredient: IngredientRow) => {
    alert("Edit ingredient is not implemented yet");
    setRefreshTrigger(!refreshTrigger);
    handleClose();
  };

  const handleClose = () => {
    setSelectedIngredient(undefined);
  };

  return (
    <>
      <Container maxWidth="md">
        <DFHeader title="Inventory" />
        <Stack gap="2rem" justifyContent="center" sx={{ pb: 12 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Ingredients</Typography>
            <CreateIngredient
              refreshIngredientList={() => setRefreshTrigger(!refreshTrigger)}
            />
          </Stack>
          <IngredientsEdit
            refreshTrigger={refreshTrigger}
            setSelectedIngredient={setSelectedIngredient}
          />
        </Stack>
      </Container>
      {selectedIngredient && (
        <ViewIngredientDialogue
          ingredient={selectedIngredient}
          handleClose={handleClose}
          submitIngredient={saveChangedIngredient}
        />
      )}
    </>
  );
};

export default Inventory;
