var SelectionStates = {
   NoSelection: "NoSelection",
   UnitHighlighted: "UnitHighlighted",
   UnitMoving: "UnitMoving"
}
// Create a unit selection fsm
var selectionFsm = new TypeState.FiniteStateMachine(SelectionStates.NoSelection);

// Declare valid transition functions
selectionFsm.from(SelectionStates.NoSelection).to(SelectionStates.UnitHighlighted);
selectionFsm.from(SelectionStates.UnitHighlighted).to(SelectionStates.NoSelection);
selectionFsm.from(SelectionStates.UnitHighlighted).to(SelectionStates.UnitMoving);
selectionFsm.from(SelectionStates.UnitMoving).to(SelectionStates.NoSelection);

