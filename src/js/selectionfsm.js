var SelectionStates = {
   NoSelection: "NoSelection",
   Selection: "Selection",
   Attack: "Attack",
   Move: "Move", 
   Confirm: "Confirm",
   Cancel: "Cancel"
}
// Create a unit selection fsm
var selectionFsm = new TypeState.FiniteStateMachine(SelectionStates.NoSelection);

// Declare valid transition functions
selectionFsm.from(SelectionStates.NoSelection).to(SelectionStates.Selection);
selectionFsm.from(SelectionStates.Selection).to(SelectionStates.NoSelection);

selectionFsm.from(SelectionStates.Selection).to(SelectionStates.Attack);
selectionFsm.from(SelectionStates.Selection).to(SelectionStates.Move);
selectionFsm.from(SelectionStates.Move).to(SelectionStates.Attack);

selectionFsm.from(SelectionStates.Attack).to(SelectionStates.Confirm);
selectionFsm.from(SelectionStates.Confirm).to(SelectionStates.Attack);
selectionFsm.from(SelectionStates.Attack).to(SelectionStates.Cancel);
selectionFsm.from(SelectionStates.Move).to(SelectionStates.Cancel);
selectionFsm.from(SelectionStates.Move).to(SelectionStates.Confirm);

selectionFsm.from(SelectionStates.Confirm).to(SelectionStates.NoSelection);
selectionFsm.from(SelectionStates.Cancel).to(SelectionStates.NoSelection);