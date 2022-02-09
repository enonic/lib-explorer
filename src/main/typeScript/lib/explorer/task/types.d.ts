export interface Task {
	description :string
    id :string
    name :string
    state :string
    application :string
    user :string
    startTime :string
    progress: {
      info :string
      current :number
      total :number
    }
}
